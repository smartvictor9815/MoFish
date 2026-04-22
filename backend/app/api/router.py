from fastapi import APIRouter

from app.api.v1.access_logs import router as access_logs_router
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(access_logs_router)
