from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps.auth import get_current_user
from app.models.user import User
from app.schemas.user import ResetPasswordRequest, UserCreate, UserOut, UserUpdate
from domain.services.user_service import (
    create_user as create_user_service,
    delete_user as delete_user_service,
    list_users as list_users_service,
    reset_user_password,
    update_user as update_user_service,
)
from app.services.log_service import create_access_log

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserOut])
def list_users(
    q: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ = current_user
    return list_users_service(db, query=q)


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="用户名已存在")

    user = create_user_service(
        db,
        username=payload.username,
        password=payload.password,
        role=payload.role,
        status=payload.status,
    )

    create_access_log(
        db=db,
        action="添加用户",
        module="用户管理",
        status="成功",
        ip=request.client.host if request.client else "",
        user=current_user,
    )
    return user


@router.patch("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    payload: UserUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")

    if (
        user.username == "admin"
        and payload.username is not None
        and payload.username != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="admin用户名不可修改",
        )

    if payload.username is not None:
        duplicate = db.query(User).filter(
            User.username == payload.username, User.id != user_id
        ).first()
        if duplicate:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="用户名已存在")

    user = update_user_service(
        db,
        user=user,
        username=payload.username,
        role=payload.role,
        status=payload.status,
    )

    create_access_log(
        db=db,
        action="编辑用户",
        module="用户管理",
        status="成功",
        ip=request.client.host if request.client else "",
        user=current_user,
    )
    return user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")
    if user.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="不能删除当前登录用户")

    delete_user_service(db, user=user)

    create_access_log(
        db=db,
        action="删除用户",
        module="用户管理",
        status="成功",
        ip=request.client.host if request.client else "",
        user=current_user,
    )
    return {"message": "删除成功"}


@router.post("/{user_id}/reset-password")
def reset_password(
    user_id: int,
    payload: ResetPasswordRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")
    reset_user_password(db, user=user, new_password=payload.new_password)

    create_access_log(
        db=db,
        action="重置密码",
        module="用户管理",
        status="成功",
        ip=request.client.host if request.client else "",
        user=current_user,
    )
    return {"message": "密码重置成功"}
