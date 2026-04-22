from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash
from app.core.timezone import now_in_system_timezone
from app.db.session import get_db
from app.deps.auth import get_current_user
from app.models.user import User
from domain.services.auth_service import authenticate_user, change_password as change_user_password
from app.schemas.auth import (
    BootstrapAdminRequest,
    BootstrapStatusResponse,
    ChangePasswordRequest,
    LoginRequest,
    LoginResponse,
)
from app.schemas.user import UserOut
from app.services.log_service import create_access_log

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/bootstrap-status", response_model=BootstrapStatusResponse)
def bootstrap_status(db: Session = Depends(get_db)):
    needs_bootstrap = db.query(User).count() == 0
    return BootstrapStatusResponse(needs_bootstrap=needs_bootstrap)


@router.post("/bootstrap-admin", response_model=LoginResponse)
def bootstrap_admin(
    payload: BootstrapAdminRequest, request: Request, db: Session = Depends(get_db)
):
    if db.query(User).count() > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="系统已完成初始化"
        )

    user = User(
        username="admin",
        password_hash=get_password_hash(payload.password),
        role="管理员",
        status="活跃",
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="系统已完成初始化"
        )
    db.refresh(user)

    create_access_log(
        db=db,
        action="初始化管理员",
        module="系统初始化",
        status="成功",
        ip=request.client.host if request.client else "",
        user=user,
    )
    token = create_access_token(user.username)
    return LoginResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = authenticate_user(db, username=payload.username, password=payload.password)
    client_ip = request.client.host if request.client else ""

    if not user:
        create_access_log(
            db=db,
            action="登录系统",
            module="登录",
            status="失败",
            ip=client_ip,
            username=payload.username,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误"
        )

    if user.status != "活跃":
        create_access_log(
            db=db,
            action="登录系统",
            module="登录",
            status="失败",
            ip=client_ip,
            user=user,
        )
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="用户已禁用")

    user.last_visit = now_in_system_timezone()
    db.add(user)
    db.commit()
    db.refresh(user)

    create_access_log(
        db=db,
        action="登录系统",
        module="登录",
        status="成功",
        ip=client_ip,
        user=user,
    )
    token = create_access_token(user.username)
    return LoginResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    changed = change_user_password(
        db, user=user, current_password=payload.current_password, new_password=payload.new_password
    )
    if not changed:
        create_access_log(
            db=db,
            action="修改密码",
            module="个人设置",
            status="失败",
            ip=request.client.host if request.client else "",
            user=user,
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="当前密码错误")

    create_access_log(
        db=db,
        action="修改密码",
        module="个人设置",
        status="成功",
        ip=request.client.host if request.client else "",
        user=user,
    )
    return {"message": "密码修改成功"}
