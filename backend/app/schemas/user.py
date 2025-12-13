from pydantic import BaseModel

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserPublic(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True