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
    
    print("[INFO] Calling lucataco/cat-vton...")
    try:
        output = client.run(
            "lucataco/cat-vton",
            input={
                "person_image": person_image,
                "cloth_image": garment_image,
                "cloth_type": "overall"
            }
        )
        print("[SUCCESS] lucataco/cat-vton response:")
        print(output)
    except Exception as e:
        print(f"[ERROR] lucataco/cat-vton failed: {e}")

if __name__ == "__main__":
    run_test()
