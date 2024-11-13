from pydantic import BaseModel, ConfigDict, EmailStr


class SUserAdd(BaseModel):
    email: EmailStr
    password: str


class SUser(SUserAdd):
    id: int
    model_config = ConfigDict(from_attributes=True)


class SUserLogin(BaseModel):
    email: EmailStr
    password: str


class ChangePasswordRequest(BaseModel):
    email: EmailStr
    old_password: str
    new_password: str
