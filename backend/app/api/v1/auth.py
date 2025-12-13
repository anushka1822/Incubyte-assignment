from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserPublic
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/register", response_model=UserPublic)
async def register_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # 1. Check if username already exists
    query = select(User).where(User.username == user_in.username)
    result = await db.execute(query)
    existing_user = result.scalars().first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # 2. Create new user object (Role defaults to "worker" in the model)
    new_user = User(
        username=user_in.username,
        hashed_password=get_password_hash(user_in.password)
    )
    
    # 3. Save to database
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user