from pydantic import BaseModel
from typing import Optional

class SweetBase(BaseModel):
    name: str
    category: str
    price: float
    quantity: int
    image_url: Optional[str] = None
    is_veg: bool = True # <--- NEW FIELD

class SweetCreate(SweetBase):
    pass

class SweetResponse(SweetBase):
    id: int
    class Config:
        from_attributes = True

class SweetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    image_url: Optional[str] = None
    is_veg: Optional[bool] = None # <--- NEW FIELD
    
class SweetInventoryOp(BaseModel):
    amount: int = 1