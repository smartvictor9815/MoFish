from sqlalchemy.orm import Session

from app.models.access_log import AccessLog
from app.models.user import User


def create_access_log(
    db: Session,
    action: str,
    module: str,
    status: str,
    ip: str,
    user: User | None = None,
    username: str | None = None,
) -> AccessLog:
    access_log = AccessLog(
        user_id=user.id if user else None,
        username=username or (user.username if user else ""),
        ip=ip or "",
        action=action,
        module=module,
        status=status,
    )
    db.add(access_log)
    db.commit()
    db.refresh(access_log)
    return access_log
