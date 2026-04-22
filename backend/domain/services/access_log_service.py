from sqlalchemy.orm import Session

from app.models.access_log import AccessLog


def list_access_logs(
    db: Session, query: str | None = None, limit: int = 50, offset: int = 0
) -> list[AccessLog]:
    orm_query = db.query(AccessLog)
    if query:
        orm_query = orm_query.filter(
            AccessLog.username.contains(query)
            | AccessLog.action.contains(query)
            | AccessLog.module.contains(query)
        )
    return (
        orm_query.order_by(AccessLog.created_at.desc())
        .offset(max(offset, 0))
        .limit(min(max(limit, 1), 200))
        .all()
    )
