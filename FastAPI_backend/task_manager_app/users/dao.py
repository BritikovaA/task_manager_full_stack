from sqlalchemy import select
from task_manager_app.database import async_session
from task_manager_app.users.models import User
from sqlalchemy import update as sqlalchemy_update
from sqlalchemy.exc import SQLAlchemyError
from task_manager_app.users.schemas import SUserAdd


class UserDao:
    model = User

    @classmethod
    async def get_user(cls):
        async with async_session() as session:
            query = select(User)
            result = await session.execute(query)
            users_model = result.scalars().all()
        return users_model

    @classmethod
    async def get_user_by_email(cls, email: str):
        async with async_session() as session:
            query = select(User).filter_by(email=email)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def get_user_by_id(cls, id: int):
        async with async_session() as session:
            query = select(User).filter_by(id=id)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def add_user(cls, user: SUserAdd) -> int:
        async with async_session() as session:
            data = user.model_dump()
            new_user = User(**data)
            session.add(new_user)
            try:
                await session.flush()
                await session.commit()
            except SQLAlchemyError as e:
                await session.rollback()
                raise e
            return new_user.id

    @classmethod
    async def update_user(cls, id, **values):
        async with async_session() as session:
            async with session.begin():
                query = (
                    sqlalchemy_update(cls.model)
                    .where(cls.model.id == id)
                    .values(**values)
                )
                result = await session.execute(query)
                try:
                    await session.flush()
                    await session.commit()
                except SQLAlchemyError as e:
                    await session.rollback()
                    raise e
                return result.rowcount
