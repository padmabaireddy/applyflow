from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .auth import create_token, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    if not verify_password(payload.password):
        raise HTTPException(status_code=401, detail="Invalid password")
    return LoginResponse(access_token=create_token())
