from enum import Enum
from pydantic import BaseModel, ConfigDict


class StatusEnum(str, Enum):
    new = "new"
    in_progress = "in progress"
    done = "done"


class PriorityEnum(str, Enum):
    kow = "Low"
    middle = "Middle"
    high = "High"


class STaskAdd(BaseModel):
    title: str
    text: str
    status: StatusEnum
    priority: PriorityEnum


class STask(STaskAdd):
    id: int
    model_config = ConfigDict(from_attributes=True)
