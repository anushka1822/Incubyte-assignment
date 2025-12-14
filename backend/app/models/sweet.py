from sqlalchemy import Column, Integer, String, Float, Boolean
from app.core.database import Base

class Sweet(Base):
    __tablename__ = "sweets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    price = Column(Float)
    quantity = Column(Integer)
    image_url = Column(String, nullable=True)
    is_veg = Column(Boolean, default=True) # <--- NEW FIELD