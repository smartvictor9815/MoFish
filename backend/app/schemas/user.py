from datetime import datetime

from pydantic import BaseModel, Field


class UserBase(BaseModel):
    username: str = Field(min_length=1, max_length=64)
    role: str = Field(default="用户")
    status: str = Field(default="活跃")


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=128)


class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=1, max_length=64)
    role: str | None = None
    status: str | None = None


class UserOut(UserBase):
    id: int
    created_at: datetime
    last_visit: datetime

    model_config = {"from_attributes": True}


class ResetPasswordRequest(BaseModel):
    new_password: str = Field(min_length=6, max_length=128)
