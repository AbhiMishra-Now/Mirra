import os
import sys
import replicate
from pathlib import Path
from dotenv import load_dotenv

# Load env variables
backend_dir = Path(__file__).resolve().parent
env_path = backend_dir / '.env'
load_dotenv(dotenv_path=env_path)

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")

def run_test():
    if not REPLICATE_API_TOKEN:
        print("[ERROR] REPLICATE_API_TOKEN is missing!")
        return

    client = replicate.Client(api_token=REPLICATE_API_TOKEN)
    
    person_image = "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600"
    # Zara floral dress
    garment_image = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600"
    
    print("[INFO] Calling cuuupid/idm-vton...")
    try:
        output = client.run(
            "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
            input={
                "crop": True,
                "seed": 42,
                "steps": 30,
                "category": "dresses",
                "garm_img": garment_image,
                "human_img": person_image,
                "garment_des": "Zara Floral Summer Dress"
            }
        )
        print("[SUCCESS] cuuupid/idm-vton response:")
        print(output)
    except Exception as e:
        print(f"[ERROR] cuuupid/idm-vton failed: {e}")

if __name__ == "__main__":
    run_test()
