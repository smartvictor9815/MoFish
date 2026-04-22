from datetime import datetime, timedelta, timezone
import base64
import hashlib
import hmac
import os

from jose import JWTError, jwt

from app.core.config import settings

ALGORITHM = "HS256"
PBKDF2_ALGORITHM = "sha256"
PBKDF2_ITERATIONS = 100000


def create_access_token(subject: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {"sub": subject, "exp": expires_at}
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None


def get_password_hash(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac(
        PBKDF2_ALGORITHM, password.encode("utf-8"), salt, PBKDF2_ITERATIONS
    )
    salt_b64 = base64.b64encode(salt).decode("utf-8")
    digest_b64 = base64.b64encode(digest).decode("utf-8")
    return f"pbkdf2_{PBKDF2_ALGORITHM}${PBKDF2_ITERATIONS}${salt_b64}${digest_b64}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        _, iterations, salt_b64, expected_b64 = hashed_password.split("$", 3)
        salt = base64.b64decode(salt_b64.encode("utf-8"))
        expected = base64.b64decode(expected_b64.encode("utf-8"))
        calculated = hashlib.pbkdf2_hmac(
            PBKDF2_ALGORITHM,
            plain_password.encode("utf-8"),
            salt,
            int(iterations),
        )
        return hmac.compare_digest(calculated, expected)
    except Exception:
        return False
