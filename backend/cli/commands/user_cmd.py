from sqlalchemy.orm import Session

from app.models.user import User
from domain.services.user_service import list_users


def list_users_command(db: Session, query: str | None = None) -> int:
    users = list_users(db, query=query)
    if not users:
        print("No users found.")
        return 0

    for user in users:
        _print_user(user)
    return 0


def _print_user(user: User) -> None:
    print(
        f"id={user.id} username={user.username} role={user.role} "
        f"status={user.status} created_at={user.created_at} last_visit={user.last_visit}"
    )
