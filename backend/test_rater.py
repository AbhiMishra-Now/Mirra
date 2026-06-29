import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Setup pathing
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from main import app

client = TestClient(app)

def test_rate_outfit():
    print("[INFO] Testing POST /api/rate-outfit...")
    payload = {
        "person_image_url": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600",
        "garment_image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
        "result_image_url": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600"
    }
    response = client.post("/api/rate-outfit", json=payload)
    print(f"  Status Code: {response.status_code}")
    print(f"  Response JSON: {response.json()}")
    assert response.status_code == 200
    assert "overall_score" in response.json()
    print("[SUCCESS] POST /api/rate-outfit testing complete!")

if __name__ == "__main__":
    test_rate_outfit()
