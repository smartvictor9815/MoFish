from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.core.timezone import now_in_system_timezone
from app.models.user import User


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def change_password(db: Session, user: User, current_password: str, new_password: str) -> bool:
    if not verify_password(current_password, user.password_hash):
        return False
    user.password_hash = get_password_hash(new_password)
    user.last_visit = now_in_system_timezone()
    db.add(user)
    db.commit()
    db.refresh(user)
    return True
