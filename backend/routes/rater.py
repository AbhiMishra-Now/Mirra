from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import sys
from pathlib import Path

routes_dir = Path(__file__).resolve().parent
backend_dir = routes_dir.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from services.fashion_rater import rate_outfit

router = APIRouter(prefix="/api/rate-outfit", tags=["Rater"])

class RatingRequest(BaseModel):
    person_image_url: str
    garment_image_url: str
    result_image_url: str

class RatingResponse(BaseModel):
    overall_score: float
    color_match: int
    style_fit: int
    occasion: int
    feedback: str

@router.post("", response_model=RatingResponse)
async def generate_rating(payload: RatingRequest):
    """
    Rates the try-on outfit compatibility using AI vision models.
    """
    try:
        rating = rate_outfit(
            person_image_url=payload.person_image_url,
            garment_image_url=payload.garment_image_url,
            result_image_url=payload.result_image_url
        )
        return RatingResponse(
            overall_score=rating.get("overall_score", 8.5),
            color_match=rating.get("color_match", 9),
            style_fit=rating.get("style_fit", 8),
            occasion=rating.get("occasion", 7),
            feedback=rating.get("feedback", "Excellent look!")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Fashion rating generation failed: {str(e)}"
        )
