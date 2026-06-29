from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
import sys
from pathlib import Path

# Add parent directory to sys.path
routes_dir = Path(__file__).resolve().parent
backend_dir = routes_dir.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from lib.dsql_client import execute_query
from services.auth import get_current_user

router = APIRouter(prefix="/api/user/history", tags=["History"])

@router.get("")
async def get_history(current_user: dict = Depends(get_current_user)):
    """
    Returns try-on history for the authenticated user from Aurora DSQL.
    """
    clerk_user_id = current_user.get("sub")
    if not clerk_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Clerk User ID (sub) not found in token payload"
        )
        
    query = """
        SELECT id, user_id, product_id, result_image_url, created_at 
        FROM try_on_sessions 
        WHERE user_id = %s 
        ORDER BY created_at DESC;
    """
    try:
        rows = execute_query(query, (clerk_user_id,), fetch=True)
        history_list = []
        if rows:
            for r in rows:
                history_list.append({
                    "id": r[0],
                    "user_id": r[1],
                    "product_id": r[2],
                    "result_image_url": r[3],
                    "created_at": r[4].isoformat() if hasattr(r[4], "isoformat") else str(r[4])
                })
        return history_list
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch try-on history: {str(e)}"
        )
