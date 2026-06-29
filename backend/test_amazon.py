import sys
from pathlib import Path

# Setup pathing
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from services.amazon_service import search_products

def run_test():
    print("[INFO] Running Amazon India Service verification...")
    
    try:
        # Search for "dress"
        products = search_products(keyword="dress", count=3)
        print(f"[SUCCESS] Retrieved {len(products)} products!")
        for idx, p in enumerate(products):
            print(f"  Product {idx+1}:")
            print(f"    ASIN: {p.get('asin')}")
            print(f"    Name: {p.get('name')}")
            print(f"    Category: {p.get('category')} / {p.get('sub_category')}")
            print(f"    Price: INR {p.get('price')}")
            print(f"    Affiliate Link: {p.get('affiliate_link')}")
            print(f"    Image: {p.get('image_url')}")
    except Exception as e:
        print(f"[ERROR] Amazon service test crash: {e}")

if __name__ == "__main__":
    run_test()
