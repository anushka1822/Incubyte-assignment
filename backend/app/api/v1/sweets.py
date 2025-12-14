from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.sweet import Sweet
from app.models.user import User
from app.schemas.sweet import SweetCreate, SweetResponse
from app.api.deps import get_current_admin
from sqlalchemy.future import select
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