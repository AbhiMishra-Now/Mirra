import os
import time
import base64
import tempfile
import replicate
from typing import Optional, Dict, Any
from pathlib import Path
from dotenv import load_dotenv

# Load env variables
services_dir = Path(__file__).resolve().parent
backend_dir = services_dir.parent
env_path = backend_dir / '.env'
load_dotenv(dotenv_path=env_path)

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")

def clean_replicate_output(output: Any) -> Optional[str]:
    """
    Parses replicate output which can be a string, list of strings, or dictionary.
    Returns the final image URL.
    """
    if not output:
        return None
    if isinstance(output, list):
        return output[0] if len(output) > 0 else None
    if isinstance(output, str):
        return output
    if isinstance(output, dict) and "image" in output:
        return output["image"]
    return str(output)

def decode_base64_to_temp_path(image_data: str) -> Optional[str]:
    """
    If image_data is a base64 string, decodes and writes to a temporary file,
    returning its file path string. Otherwise, returns None.
    """
    if image_data.startswith("data:image/"):
        try:
            header, encoded = image_data.split(",", 1)
            ext = "jpg"
            if "png" in header:
                ext = "png"
            elif "webp" in header:
                ext = "webp"
            
            data = base64.b64decode(encoded)
            temp_file = tempfile.NamedTemporaryFile(suffix=f".{ext}", delete=False)
            temp_file.write(data)
            temp_file.close()
            return temp_file.name
        except Exception as e:
            print(f"[ERROR] Failed to decode base64: {e}")
            return None
    return None

def map_garment_type_to_vton(garment_type: str) -> str:
    """
    Maps category tags or product types to VTON parameters: 'upper_body', 'lower_body', or 'overall'.
    """
    g = garment_type.lower()
    if g in ["upper_body", "lower_body", "overall"]:
        return g
    if "shirt" in g or "top" in g or "blouse" in g or "clothing" in g or "upper" in g or "jacket" in g or "hoodie" in g:
        return "upper_body"
    if "pant" in g or "jeans" in g or "lower" in g or "skirt" in g or "trousers" in g or "chinos" in g:
        return "lower_body"
    if "dress" in g or "gown" in g or "overall" in g:
        return "overall"
    return "overall"

def generate_tryon(person_image_url: str, garment_image_url: str, garment_type: str = "clothing") -> Dict[str, Any]:
    """
    Generates a virtual try-on using Replicate models.
    Primary: google/nano-banana
    Fallback: lucataco/cat-vton
    """
    # Fallback placeholder in case token is missing (hackathon grace)
    if not REPLICATE_API_TOKEN or REPLICATE_API_TOKEN.startswith("your_"):
        print("[WARNING] REPLICATE_API_TOKEN is not configured or placeholder. Returning seed try-on.")
        fallback_res = "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800"
        return {
            "image_url": fallback_res,
            "latency_ms": 120,
            "model_used": "mock_placeholder_seed",
            "success": False,
            "error_log": "REPLICATE_API_TOKEN is missing or placeholder."
        }

    temp_path = decode_base64_to_temp_path(person_image_url)
    
    person_file1 = None
    person_file2 = None
    person_file3 = None
    
    if temp_path:
        person_file1 = open(temp_path, "rb")
        person_file2 = open(temp_path, "rb")
        person_file3 = open(temp_path, "rb")
        person_input1 = person_file1
        person_input2 = person_file2
        person_input3 = person_file3
    else:
        person_input1 = person_image_url
        person_input2 = person_image_url
        person_input3 = person_image_url

    try:
        # Instantiate Replicate client securely using token
        client = replicate.Client(api_token=REPLICATE_API_TOKEN)

        vton_cloth_type = map_garment_type_to_vton(garment_type)

        # Build the required prompt
        prompt_text = (
            f"Perform a virtual try-on. Replace the {vton_cloth_type} worn by the person in the source image "
            f"with the garment shown in the reference image. "
            "Maintain the person's exact pose, facial expression, body shape, skin color, and background details. "
            "Ensure the reference garment fits the person naturally and aligns correctly with their body perspective."
        )

        start_time = time.time()
        
        # --- 1. Primary Model: cuuupid/idm-vton ---
        try:
            print(f"Calling primary model cuuupid/idm-vton...")
            idm_category = "dresses" if vton_cloth_type == "overall" else vton_cloth_type
            
            model_input = {
                "human_img": person_input1,
                "garm_img": garment_image_url,
                "category": idm_category,
                "garment_des": f"Try-on garment: {garment_type}",
                "crop": True,
                "seed": 42,
                "steps": 30
            }
            
            output = client.run(
                "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
                input=model_input
            )
            
            image_url = clean_replicate_output(output)
            if image_url and image_url.startswith("http"):
                latency = int((time.time() - start_time) * 1000)
                return {
                    "image_url": image_url,
                    "latency_ms": latency,
                    "model_used": "cuuupid/idm-vton",
                    "success": True
                }
            else:
                raise ValueError(f"Invalid primary model output format: {output}")

        except Exception as e:
            print(f"[WARNING] Primary model cuuupid/idm-vton failed: {e}. Attempting fallback to google/nano-banana...")
            
        # --- 2. Fallback Model: google/nano-banana ---
        try:
            print(f"Calling fallback model google/nano-banana with prompt: {prompt_text}")
            if person_file2:
                person_file2.seek(0)
                
            model_input = {
                "image": person_input2,
                "person_image": person_input3,
                "garment_image": garment_image_url,
                "cloth_image": garment_image_url,
                "prompt": prompt_text,
                "system_prompt": prompt_text,
                "garment_type": vton_cloth_type,
                "cloth_type": vton_cloth_type
            }
            
            output = client.run(
                "google/nano-banana",
                input=model_input
            )
            
            image_url = clean_replicate_output(output)
            if image_url and image_url.startswith("http"):
                latency = int((time.time() - start_time) * 1000)
                return {
                    "image_url": image_url,
                    "latency_ms": latency,
                    "model_used": "google/nano-banana",
                    "success": True
                }
            else:
                raise ValueError(f"Invalid fallback model output format: {output}")
                
        except Exception as e:
            print(f"[ERROR] Fallback model google/nano-banana failed: {e}")
            placeholder_url = "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200"
            latency = int((time.time() - start_time) * 1000)
            return {
                "image_url": placeholder_url,
                "latency_ms": latency,
                "model_used": "mock_placeholder_fallback",
                "success": False,
                "error_log": str(e)
            }
    finally:
        if person_file1:
            person_file1.close()
        if person_file2:
            person_file2.close()
        if person_file3:
            person_file3.close()
        if temp_path:
            try:
                os.unlink(temp_path)
                print(f"[INFO] Successfully unlinked temp file: {temp_path}")
            except Exception as ex:
                print(f"[WARNING] Failed to unlink temp file: {ex}")
