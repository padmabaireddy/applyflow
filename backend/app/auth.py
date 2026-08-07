import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

SECRET_KEY = os.getenv("AUTH_SECRET", "applyflow-dev-secret-change-me")
DEMO_PASSWORD = os.getenv("DEMO_PASSWORD", "demo")
ALGORITHM = "HS256"
TOKEN_HOURS = 72

bearer = HTTPBearer(auto_error=False)


def create_token() -> str:
    payload = {
        "sub": "demo",
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_HOURS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_password(password: str) -> bool:
    return password == DEMO_PASSWORD


def require_write(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
):
    if os.getenv("AUTH_DISABLED", "").lower() in {"1", "true", "yes"}:
        return
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login required to modify applications",
        )
    try:
        jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc
