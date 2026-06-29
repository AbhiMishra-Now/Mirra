import sys
from pathlib import Path

# Setup pathing
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from services.vton_service import generate_tryon

def run_test():
    print("[INFO] Running VTON Replicate Service verification...")
    
    # Sample images
    person_image = "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600"
    garment_image = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600"
    
    try:
        result = generate_tryon(
            person_image_url=person_image,
            garment_image_url=garment_image,
            garment_type="dress"
        )
        print("[SUCCESS] VTON execution completed!")
        print(f"   Model Used: {result.get('model_used')}")
        print(f"   Success Status: {result.get('success')}")
        print(f"   Latency: {result.get('latency_ms')} ms")
        print(f"   Image URL: {result.get('image_url')}")
        if not result.get('success'):
            print(f"   Error Log: {result.get('error_log')}")
    except Exception as e:
        print(f"[ERROR] VTON test crash: {e}")

if __name__ == "__main__":
    run_test()
