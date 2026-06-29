from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional
import sys
from pathlib import Path

routes_dir = Path(__file__).resolve().parent
backend_dir = routes_dir.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from services.vton_service import generate_tryon
from lib.dsql_client import execute_query
from services.auth import get_current_user

router = APIRouter(prefix="/api/generate-tryon", tags=["TryOn"])

class TryOnRequest(BaseModel):
    person_image_url: str
    garment_image_url: str
    garment_type: Optional[str] = "clothing"
    product_id: Optional[str] = None

class TryOnResponse(BaseModel):
    image_url: str
    latency_ms: int
    model_used: str
    success: bool
    error_log: Optional[str] = None

    model_config = {
        "protected_namespaces": ()
    }


@router.post("", response_model=TryOnResponse)
async def trigger_tryon(
    payload: TryOnRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Triggers visual try-on with Replicate services.
    """
    try:
        result = generate_tryon(
            person_image_url=payload.person_image_url,
            garment_image_url=payload.garment_image_url,
            garment_type=payload.garment_type
        )
        
        # Save to try_on_sessions if VTON succeeded and user is authenticated
        if result.get("success") and result.get("image_url"):
            clerk_user_id = current_user.get("sub")
            if clerk_user_id:
                try:
                    insert_query = """
                        INSERT INTO try_on_sessions (
                            id, 
                            user_id, 
                            product_id, 
                            result_image_url, 
                            created_at
                        ) VALUES (
                            gen_random_uuid(), 
                            %s, 
                            %s, 
                            %s, 
                            NOW()
                        ) RETURNING id;
                    """
                    execute_query(
                        insert_query, 
                        (clerk_user_id, payload.product_id or "unknown", result["image_url"]), 
                        fetch=True
                    )
                    print(f"[SUCCESS] Saved try-on session to Aurora DSQL for user {clerk_user_id}")
                except Exception as db_err:
                    print(f"[ERROR] Failed to save try-on session history to DSQL: {db_err}")

        return TryOnResponse(
            image_url=result.get("image_url"),
            latency_ms=result.get("latency_ms", 0),
            model_used=result.get("model_used", "unknown"),
            success=result.get("success", False),
            error_log=result.get("error_log")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Try-on generation error: {str(e)}"
        )
