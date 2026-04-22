from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps.auth import get_current_user
from app.models.user import User
from app.schemas.access_log import AccessLogOut
from domain.services.access_log_service import list_access_logs as list_access_logs_service

router = APIRouter(prefix="/access-logs", tags=["access-logs"])


@router.get("", response_model=list[AccessLogOut])
def list_access_logs(
    q: str | None = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ = current_user
    return list_access_logs_service(db, query=q, limit=limit, offset=offset)
