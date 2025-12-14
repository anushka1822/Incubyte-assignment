import asyncio
import sys
import os

# Ensure we can find the 'app' module
sys.path.append(os.getcwd())

from app.core.database import engine, Base
# Import models so SQLAlchemy knows about them
from app.models.user import User
from app.models.sweet import Sweet

async def reset_database():
    async with engine.begin() as conn:
        print("🗑️  Dropping old tables...")
        await conn.run_sync(Base.metadata.drop_all)
        
        print("✨ Creating new tables (with is_veg column)...")
        await conn.run_sync(Base.metadata.create_all)
        
    print("✅ Database reset successfully!")

if __name__ == "__main__":
    asyncio.run(reset_database())