import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
services_dir = Path(__file__).resolve().parent
backend_dir = services_dir.parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "https://api.clerk.com/v1/jwks")

# Bearer Authorization helper
security = HTTPBearer()

class ClerkJWTValidator:
    def __init__(self, default_jwks_url: str):
        self.default_jwks_url = default_jwks_url
        self.clients = {}

    def validate(self, token: str) -> dict:
        try:
            # Decode payload without verification first to get the issuer (iss)
            unverified = jwt.decode(token, options={"verify_signature": False})
            issuer = unverified.get("iss")
            if not issuer:
                raise jwt.InvalidTokenError("Missing issuer (iss) claim in token")
            
            # Construct the correct public JWKS endpoint for this Clerk instance
            jwks_url = f"{issuer.rstrip('/')}/.well-known/jwks.json"
            if jwks_url not in self.clients:
                self.clients[jwks_url] = jwt.PyJWKClient(jwks_url)
            
            jwks_client = self.clients[jwks_url]
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            
            # Verify and decode RS256 signature
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                options={"verify_aud": False}  # Clerk default JWT templates do not check aud
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Auth server signature verification issue: {str(e)}",
            )

# Instantiate singleton validator
validator = ClerkJWTValidator(CLERK_JWKS_URL)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    FastAPI security dependency to validate incoming Clerk JWT Bearer Tokens.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return validator.validate(credentials.credentials)
