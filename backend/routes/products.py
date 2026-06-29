from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import sys
from pathlib import Path

# Add parent directory to sys.path to support imports
routes_dir = Path(__file__).resolve().parent
backend_dir = routes_dir.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from services.amazon_service import search_products

router = APIRouter(prefix="/api/products", tags=["Products"])

class ProductResponse(BaseModel):
    id: str
    name: str
    price: float
    image: str
    category: str
    sub_category: str
    affiliateLink: Optional[str] = None
    description: Optional[str] = None

@router.get("", response_model=List[ProductResponse])
async def get_products(keyword: Optional[str] = "fashion", limit: Optional[int] = 40):
    """
    Retrieves fashion products from local seed catalog (or Amazon India) and returns them.
    """
    try:
        amazon_products = search_products(keyword=keyword, count=limit)
        response_data = []
        for p in amazon_products:
            response_data.append(ProductResponse(
                id=p.get("asin", "B08XWP27W2"),
                name=p.get("name", "Fashion Item"),
                price=float(p.get("price", 999)),
                image=p.get("image_url", ""),
                category=p.get("category", "clothing"),
                sub_category=p.get("sub_category", "clothing"),
                affiliateLink=p.get("affiliate_link"),
                description=p.get("description")
            ))
        return response_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Product retrieval error: {str(e)}"
        )
