import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Setup pathing
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from main import app

client = TestClient(app)

def test_get_products():
    print("[INFO] Testing GET /api/products...")
    response = client.get("/api/products?keyword=dress&limit=2")
    print(f"  Status Code: {response.status_code}")
    print(f"  Response JSON: {response.json()}")
    assert response.status_code == 200
    assert len(response.json()) > 0
    print("[SUCCESS] GET /api/products testing complete!")

def test_post_tryon():
    print("[INFO] Testing POST /api/generate-tryon...")
    payload = {
        "person_image_url": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600",
        "garment_image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
        "garment_type": "dress"
    }
    response = client.post("/api/generate-tryon", json=payload)
    print(f"  Status Code: {response.status_code}")
    print(f"  Response JSON: {response.json()}")
    assert response.status_code == 200
    print("[SUCCESS] POST /api/generate-tryon testing complete!")

if __name__ == "__main__":
    print("[INFO] Running API route integration tests...")
    try:
        test_get_products()
        print("-" * 50)
        test_post_tryon()
        print("[SUCCESS] All API route tests passed successfully!")
    except Exception as e:
        print(f"[ERROR] API routes test crash: {e}")
