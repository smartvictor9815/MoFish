from datetime import datetime

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.core.timezone import now_in_system_timezone


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(16), default="用户", nullable=False)
    status: Mapped[str] = mapped_column(String(16), default="活跃", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now_in_system_timezone, nullable=False
    )
    last_visit: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now_in_system_timezone, nullable=False
    )

    access_logs = relationship("AccessLog", back_populates="user")
