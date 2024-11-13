from sqlalchemy import select
from database import async_session, Tasks
from sqlalchemy import update as sqlalchemy_update, delete as sqlalchemy_delete
from sqlalchemy.exc import SQLAlchemyError
from models import STaskAdd


class TaskDao:
    model = Tasks

    @classmethod
    async def get_tasks(cls):
        async with async_session() as session:
            query = select(Tasks)
            result = await session.execute(query)
            tasks_model = result.scalars().all()
        return tasks_model

    @classmethod
    async def get_task_by_id(cls, task_id: int):
        async with async_session() as session:
            query = select(Tasks).filter_by(id=task_id)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def add_task(cls, task: STaskAdd) -> int:
        async with async_session() as session:
            data = task.model_dump()
            new_task = Tasks(**data)
            session.add(new_task)
            try:
                await session.flush()
                await session.commit()
            except SQLAlchemyError as e:
                await session.rollback()
                raise e
            return new_task.id

    @classmethod
    async def update_task(cls, id: int, task: STaskAdd):
        async with async_session() as session:
            async with session.begin():
                query = (
                    sqlalchemy_update(cls.model)
                    .where(cls.model.id == id)
                    .values(
                        title=task.title,
                        text=task.text,
                        status=task.status,
                        priority=task.priority
                    )
                )
                result = await session.execute(query)
                try:
                    await session.flush()
                    await session.commit()
                except SQLAlchemyError as e:
                    await session.rollback()
                    raise e
                return result.rowcount

    @classmethod
    async def delete_task(cls, task_id: int = 0):
        async with async_session() as session:
            async with session.begin():
                query = sqlalchemy_delete(cls.model).filter_by(id=task_id)
                result = await session.execute(query)
                try:
                    await session.flush()
                    await session.commit()
                except SQLAlchemyError as e:
                    await session.rollback()
                    raise e
                return result.rowcount
