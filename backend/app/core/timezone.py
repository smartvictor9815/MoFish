from datetime import datetime
from zoneinfo import ZoneInfo

from app.core.config import settings


def get_system_timezone() -> ZoneInfo:
    return ZoneInfo(settings.system_timezone)


def now_in_system_timezone() -> datetime:
    return datetime.now(get_system_timezone())
