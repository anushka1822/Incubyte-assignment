from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: str = "customer" # <--- Allow role input (default to customer)

class UserResponse(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True