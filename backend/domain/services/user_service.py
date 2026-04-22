from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User


def list_users(db: Session, query: str | None = None) -> list[User]:
    orm_query = db.query(User)
    if query:
        orm_query = orm_query.filter(User.username.contains(query))
    return orm_query.order_by(User.id.asc()).all()


def create_user(
    db: Session,
    username: str,
    password: str,
    role: str = "用户",
    status: str = "活跃",
) -> User:
    user = User(
        username=username,
        password_hash=get_password_hash(password),
        role=role,
        status=status,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(
    db: Session,
    user: User,
    username: str | None = None,
    role: str | None = None,
    status: str | None = None,
) -> User:
    if username is not None:
        user.username = username
    if role is not None:
        user.role = role
    if status is not None:
        user.status = status
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()


def reset_user_password(db: Session, user: User, new_password: str) -> User:
    user.password_hash = get_password_hash(new_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
