from datetime import datetime

from pydantic import BaseModel


class AccessLogOut(BaseModel):
    id: int
    username: str
    ip: str
    action: str
    module: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
