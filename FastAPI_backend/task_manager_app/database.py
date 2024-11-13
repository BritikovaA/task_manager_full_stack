from enum import Enum
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, declared_attr, Mapped, mapped_column
from sqlalchemy import Enum as SQLAlchemyEnum

DB_HOST = 'localhost'
DB_PORT = '5430'
DB_NAME = 'postgres_db'
DB_USER = 'admin'
DB_PASSWORD = 'adminpass'

DATABASE_URL = f'postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class StatusEnum(str, Enum):
    new = "new"
    in_progress = "in progress"
    done = "done"


class PriorityEnum(str, Enum):
    low = "Low"
    middle = "Middle"
    high = "High"


class Tasks(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    text: Mapped[str]
    priority: Mapped[PriorityEnum] = mapped_column(SQLAlchemyEnum(PriorityEnum), nullable=False)
    status: Mapped[StatusEnum] = mapped_column(SQLAlchemyEnum(StatusEnum), nullable=False)


async_session = async_sessionmaker(autoflush=False, bind=engine, expire_on_commit=False)
