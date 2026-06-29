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
    
    print("[INFO] Searching Replicate for 'vton'...")
    try:
        results = client.models.search("vton")
        print(f"[SUCCESS] Found {len(results.results)} models:")
        for idx, model in enumerate(results.results):
            print(f"Model {idx+1}:")
            print(f"  Name: {model.owner}/{model.name}")
            print(f"  Description: {model.description}")
            print(f"  Url: https://replicate.com/{model.owner}/{model.name}")
    except Exception as e:
        print(f"[ERROR] Search failed: {e}")

if __name__ == "__main__":
    run_test()
