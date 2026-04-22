from sqlalchemy.orm import Session

from domain.services.access_log_service import list_access_logs


def list_logs_command(db: Session, query: str | None = None, limit: int = 20) -> int:
    logs = list_access_logs(db, query=query, limit=limit, offset=0)
    if not logs:
        print("No access logs found.")
        return 0

    for item in logs:
        print(
            f"id={item.id} username={item.username} ip={item.ip} action={item.action} "
            f"module={item.module} status={item.status} at={item.created_at}"
        )
    return 0
