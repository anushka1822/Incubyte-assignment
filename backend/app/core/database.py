from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool  # <--- IMPORT THIS
from app.core.config import settings

# Create the Async Engine
# poolclass=NullPool is CRITICAL for tests to prevent "Event loop" errors
engine = create_async_engine(
    settings.DATABASE_URL, 
    echo=True,
    poolclass=NullPool
)

# Create the Session Factory
SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with SessionLocal() as session:
        yield session
