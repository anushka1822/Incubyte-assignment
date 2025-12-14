from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_ # <--- NEW IMPORT
from typing import List, Optional

from app.core.database import get_db
from app.models.user import User
from app.models.sweet import Sweet
from app.schemas.sweet import SweetCreate, SweetResponse, SweetUpdate, SweetInventoryOp # <--- NEW IMPORT
from app.core.security import get_current_user, get_current_admin
router = APIRouter()

@router.post("/", response_model=SweetResponse)
async def create_sweet(
    sweet_in: SweetCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)  # Protect: Admin Only
):
    new_sweet = Sweet(**sweet_in.model_dump())
    db.add(new_sweet)
    await db.commit()
    await db.refresh(new_sweet)
    return new_sweet

@router.get("/", response_model=list[SweetResponse])
async def list_sweets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Sweet))
    return result.scalars().all()

# --- SEARCH SWEETS ---
@router.get("/search", response_model=List[SweetResponse])
async def search_sweets(
    name: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Sweet)
    filters = []
    
    if name:
        filters.append(Sweet.name.ilike(f"%{name}%")) # Case-insensitive search
    if category:
        filters.append(Sweet.category.ilike(f"%{category}%"))
    if min_price is not None:
        filters.append(Sweet.price >= min_price)
    if max_price is not None:
        filters.append(Sweet.price <= max_price)
    
    if filters:
        query = query.where(and_(*filters))
    
    result = await db.execute(query)
    return result.scalars().all()

# --- PURCHASE SWEET (Decrease Stock) ---
@router.post("/{sweet_id}/purchase", response_model=SweetResponse)
async def purchase_sweet(
    sweet_id: int,
    operation: SweetInventoryOp,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user) # Any logged-in user can buy
):
    result = await db.execute(select(Sweet).where(Sweet.id == sweet_id))
    sweet = result.scalars().first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    
    if sweet.quantity < operation.amount:
        raise HTTPException(status_code=400, detail="Not enough stock available")

    sweet.quantity -= operation.amount
    await db.commit()
    await db.refresh(sweet)
    return sweet

# --- RESTOCK SWEET (Increase Stock) ---
@router.post("/{sweet_id}/restock", response_model=SweetResponse)
async def restock_sweet(
    sweet_id: int,
    operation: SweetInventoryOp,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin) # Only Admin can restock
):
    result = await db.execute(select(Sweet).where(Sweet.id == sweet_id))
    sweet = result.scalars().first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    sweet.quantity += operation.amount
    await db.commit()
    await db.refresh(sweet)
    return sweet

@router.put("/{sweet_id}", response_model=SweetResponse)
async def update_sweet(
    sweet_id: int,
    sweet_update: SweetUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin) # Secure: Only Admin
):
    query = select(Sweet).where(Sweet.id == sweet_id)
    result = await db.execute(query)
    sweet = result.scalars().first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    # Update only the fields provided
    update_data = sweet_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(sweet, key, value)

    await db.commit()
    await db.refresh(sweet)
    return sweet

# --- DELETE SWEET ---
@router.delete("/{sweet_id}", status_code=status.HTTP_200_OK)
async def delete_sweet(
    sweet_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin) # Secure: Only Admin
):
    query = select(Sweet).where(Sweet.id == sweet_id)
    result = await db.execute(query)
    sweet = result.scalars().first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    await db.delete(sweet)
    await db.commit()
    
    return {"message": "Sweet deleted successfully"}