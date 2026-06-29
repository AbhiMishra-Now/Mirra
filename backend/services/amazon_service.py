import os
import json
from typing import List, Dict, Any
from pathlib import Path
from dotenv import load_dotenv

# Load env variables
services_dir = Path(__file__).resolve().parent
backend_dir = services_dir.parent
env_path = backend_dir / '.env'
load_dotenv(dotenv_path=env_path)

# Credentials
AMAZON_ACCESS_KEY = os.getenv("AMAZON_ACCESS_KEY")
AMAZON_SECRET_KEY = os.getenv("AMAZON_SECRET_KEY")
AMAZON_ASSOCIATE_TAG = os.getenv("AMAZON_ASSOCIATE_TAG", "mirra0a-21")

def get_seed_products() -> List[Dict[str, Any]]:
    """
    Loads fallback products from local seed JSON and injects dynamic affiliate links.
    """
    seed_path = backend_dir / "data" / "seed_products.json"
    if not seed_path.exists():
        print(f"[ERROR] seed_products.json not found at {seed_path}")
        return []
    try:
        with open(seed_path, "r", encoding="utf-8") as f:
            products = json.load(f)
            
        # Dynamically inject the correct tracking code into every product
        for p in products:
            asin = p.get("asin", "B08XWP27W2")
            p["affiliate_link"] = f"https://www.amazon.in/dp/{asin}?tag={AMAZON_ASSOCIATE_TAG}"
        return products
    except Exception as e:
        print(f"[ERROR] Failed to load seed products: {e}")
        return []

def search_products(keyword: str = "fashion", count: int = 10) -> List[Dict[str, Any]]:
    """
    Searches products from Amazon India (webservices.amazon.in).
    Falls back to seed_products.json on missing credentials, throttles, or network issues.
    """
    # 1. Check if PA-API credentials are configured
    if not AMAZON_ACCESS_KEY or not AMAZON_SECRET_KEY or AMAZON_ACCESS_KEY.startswith("your_"):
        print("[INFO] Amazon PA-API credentials not configured. Falling back to local catalog.")
        return filter_seed_products(keyword, count)

    # 2. Attempt Amazon PA-API Search
    try:
        from amazon_paapi import AmazonAPI
        
        # Initialize client for Amazon India marketplace
        amazon = AmazonAPI(
            access_key=AMAZON_ACCESS_KEY,
            secret_key=AMAZON_SECRET_KEY,
            partner_tag=AMAZON_ASSOCIATE_TAG,
            marketplace="IN"
        )
        
        # Call search items api
        # SearchIndex 'Apparel' is best for fashion
        search_index = "Apparel" if keyword.lower() in ["fashion", "clothing", "dress", "shirt", "jacket", "pants"] else "All"
        
        print(f"[INFO] Querying Amazon India PA-API for index '{search_index}' with keyword '{keyword}'...")
        results = amazon.search_items(
            keywords=keyword,
            search_index=search_index,
            item_count=min(count, 10)
        )
        
        products = []
        if results and hasattr(results, "items") and results.items:
            for item in results.items:
                # Extract pricing details in INR
                price_val = 999
                if hasattr(item, "offers") and item.offers and item.offers.listings:
                    price_val = int(item.offers.listings[0].price.amount)
                
                # Extract clean image url
                image_url = ""
                if hasattr(item, "images") and item.images and item.images.primary:
                    image_url = item.images.primary.large.url

                products.append({
                    "asin": item.asin,
                    "name": item.item_info.title.display_value,
                    "category": "fashion",
                    "sub_category": detect_subcategory(item.item_info.title.display_value),
                    "price": price_val,
                    "rating": 4.2,
                    "image_url": image_url,
                    "affiliate_link": item.detail_page_url,
                    "description": f"Official product on Amazon India. ASIN: {item.asin}"
                })
            
            if products:
                return products
            
        print("[WARNING] Amazon India PA-API returned empty results. Using local catalog fallback.")
        
    except Exception as e:
        print(f"[WARNING] Amazon PA-API call failed: {e}. Using local catalog fallback.")
        
    return filter_seed_products(keyword, count)

def filter_seed_products(keyword: str, count: int) -> List[Dict[str, Any]]:
    """
    Filters seed products based on a simple keyword matching query.
    """
    all_seeds = get_seed_products()
    if keyword.lower() == "fashion" or not keyword:
        return all_seeds[:count]
        
    filtered = []
    kw = keyword.lower()
    for p in all_seeds:
        if (kw in p["name"].lower() or 
            kw == p["category"].lower() or 
            kw == p["sub_category"].lower() or 
            kw in p.get("description", "").lower()):
            filtered.append(p)
            
    if not filtered:
        return all_seeds[:count]
    return filtered[:count]

def detect_subcategory(title: str) -> str:
    """
    Simple helper to detect sub-category tags from product titles.
    """
    t = title.lower()
    if "dress" in t:
        return "dress"
    if "shirt" in t or "tee" in t or "blouse" in t or "hoodie" in t or "sweatshirt" in t:
        return "shirt"
    if "jacket" in t or "coat" in t or "blazer" in t:
        return "jacket"
    if "pant" in t or "jeans" in t or "skirt" in t or "jogger" in t:
        return "pants"
    return "clothing"
