from pydantic import BaseModel
from typing import Optional

class SweetBase(BaseModel):
    name: str
    category: str
    price: float
    quantity: int
    image_url: Optional[str] = None

class SweetCreate(SweetBase):
    pass

class SweetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None

class SweetResponse(SweetBase):
    id: int

    class Config:
        from_attributes = True