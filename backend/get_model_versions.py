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
    
    print("[INFO] Fetching versions for cuuupid/idm-vton...")
    try:
        model = client.models.get("cuuupid/idm-vton")
        versions = model.versions.list()
        print(f"[SUCCESS] Found {len(versions)} versions:")
        for idx, ver in enumerate(versions[:10]):
            print(f"  Version {idx+1}: {ver.id}")
    except Exception as e:
        print(f"[ERROR] Failed to get model: {e}")

if __name__ == "__main__":
    run_test()
