from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
import sys
from pathlib import Path

# Add parent directory to sys.path to support imports
routes_dir = Path(__file__).resolve().parent
backend_dir = routes_dir.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from lib.dsql_client import execute_query

router = APIRouter(prefix="/api/users", tags=["Users"])

class UserSyncRequest(BaseModel):
    id: str
    email: EmailStr
    name: Optional[str] = None

class UserUpgradeRequest(BaseModel):
    id: str
    tier: str

class UserDeleteRequest(BaseModel):
    id: str

@router.post("/sync")
async def sync_user(payload: UserSyncRequest):
    """
    Upserts the user details into Aurora DSQL using raw SQL.
    Defaults tier to 'FREE' on creation.
    """
    query = """
        INSERT INTO users (id, email, name, tier, updated_at)
        VALUES (%s, %s, %s, 'PRO', CURRENT_TIMESTAMP)
        ON CONFLICT (id) 
        DO UPDATE SET 
            email = EXCLUDED.email, 
            name = EXCLUDED.name, 
            tier = 'PRO',
            updated_at = CURRENT_TIMESTAMP
        RETURNING id, email, name, tier;
    """
    params = (payload.id, payload.email, payload.name)
    try:
        # execute_query is defined to fetch=True by default
        result = execute_query(query, params, fetch=True)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Upsert failed: Database returned no data"
            )
        
        user_row = result[0]
        return {
            "id": user_row[0],
            "email": user_row[1],
            "name": user_row[2],
            "tier": user_row[3],
            "synced": True
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database synchronization error: {str(e)}"
        )

@router.post("/upgrade")
async def upgrade_user(payload: UserUpgradeRequest):
    """
    Upgrades a user's subscription tier in Aurora DSQL.
    """
    if payload.tier not in ["FREE", "PRO"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid tier value. Must be 'FREE' or 'PRO'"
        )
        
    query = """
        UPDATE users
        SET tier = %s, updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
        RETURNING id, email, name, tier;
    """
    params = (payload.tier, payload.id)
    try:
        result = execute_query(query, params, fetch=True)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {payload.id} not found"
            )
            
        user_row = result[0]
        return {
            "id": user_row[0],
            "email": user_row[1],
            "name": user_row[2],
            "tier": user_row[3],
            "upgraded": True
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database upgrade error: {str(e)}"
        )

@router.post("/delete")
async def delete_user(payload: UserDeleteRequest):
    """
    Deletes the user and cascaded relations from Aurora DSQL.
    """
    query = """
        DELETE FROM users
        WHERE id = %s
        RETURNING id;
    """
    params = (payload.id,)
    try:
        result = execute_query(query, params, fetch=True)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {payload.id} not found"
            )
            
        return {
            "id": result[0][0],
            "deleted": True
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database delete error: {str(e)}"
        )
