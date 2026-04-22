from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User


def seed_admin_user(db: Session):
    admin = db.query(User).filter(User.username == "admin").first()
    if admin:
        return

    db.add(
        User(
            username="admin",
            password_hash=get_password_hash("hw12345"),
            role="管理员",
            status="活跃",
        )
    )
    db.commit()
