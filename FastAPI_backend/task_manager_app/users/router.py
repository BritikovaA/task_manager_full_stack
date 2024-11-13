from fastapi import APIRouter, HTTPException, status, Depends, Response
from task_manager_app.users.auth import authenticate_user, create_access_token, get_password_hash, verify_password
from task_manager_app.users.dao import UserDao
from task_manager_app.users.schemas import SUserAdd, SUserLogin, ChangePasswordRequest
from task_manager_app.database import async_session
from sqlalchemy import select
from sqlalchemy import update as sqlalchemy_update
from sqlalchemy.exc import SQLAlchemyError
from task_manager_app.users.models import User

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post("/register/")
async def register_user(user_data: SUserAdd = Depends()) -> dict:
    user = await UserDao.get_user_by_email(email=user_data.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='There is no user with such email'
        )
    user_dict = user_data.dict()
    user_dict['password'] = get_password_hash(user_data.password)
    new_user = SUserAdd(**user_dict)
    await UserDao.add_user(new_user)
    return {'message': 'Registration success!'}


@router.post("/login/")
async def auth_user(response: Response, user_data: SUserLogin):
    check = await authenticate_user(email=user_data.email, password=user_data.password)
    if check is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Invalid password or email')
    access_token = create_access_token({"sub": str(check.id)})
    response.set_cookie(key="users_access_token", value=access_token, httponly=True)
    return {'access_token': access_token, 'refresh_token': None, 'message': 'Authorisation successful!'}


@router.post("/logout/")
async def logout_user(response: Response):
    response.delete_cookie(key="users_access_token")
    return {'message': 'Logout successful! '}


@router.post("/change_password/")
async def change_password(request: ChangePasswordRequest, response: Response):
    email = request.email
    old_password = request.old_password
    new_password = request.new_password
    async with async_session() as session:
        async with session.begin():
            query = select(User).filter_by(email=email)
            result = await session.execute(query)
            user = result.scalar_one_or_none()

            if user is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

            if not verify_password(old_password, user.password):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

            update_query = (
                sqlalchemy_update(User)
                .where(User.email == email)
                .values(password=get_password_hash(new_password))
            )
            await session.execute(update_query)
            try:
                await session.flush()
                await session.commit()
                return {'message': 'Password was changed!'}
            except SQLAlchemyError as e:
                await session.rollback()
                raise e
