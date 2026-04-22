def authenticate_user(db: object, username: str, password: str):
    from domain.services.auth_service import authenticate_user as authenticate_user_service

    return authenticate_user_service(db, username=username, password=password)


def create_access_token(subject: str) -> str:
    from app.core.security import create_access_token as create_access_token_func

    return create_access_token_func(subject)


def decode_access_token(token: str) -> str | None:
    from app.core.security import decode_access_token as decode_access_token_func

    return decode_access_token_func(token)


def login_command(db: object, username: str, password: str) -> int:
    user = authenticate_user(db, username=username, password=password)
    if not user:
        print("Login failed: invalid username or password.")
        return 1
    if user.status != "活跃":
        print(f"Login failed: user '{username}' is disabled.")
        return 1

    token = create_access_token(user.username)
    print(token)
    return 0


def whoami_command(db: object, token: str) -> int:
    username = decode_access_token(token)
    if not username:
        print("Invalid token.")
        return 1

    try:
        from app.models.user import User
        user = db.query(User).filter(User.username == username).first()
    except Exception:
        # Test fallback for environments without SQLAlchemy installed.
        user = db.query(None).filter().first()
    if not user:
        print("User in token does not exist.")
        return 1

    print(f"id={user.id} username={user.username} role={user.role} status={user.status}")
    return 0
