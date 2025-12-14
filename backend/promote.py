import asyncio
import sys
import os

# Ensure we can import the app
sys.path.append(os.getcwd())

from sqlalchemy import text
from app.core.database import engine

async def promote():
    async with engine.begin() as conn:
        # Force update the user 'admin' to role 'admin'
        await conn.execute(text("UPDATE users SET role = 'admin' WHERE username = 'user1'"))
    print("✅ SUCCESS: User 'admin' is now an Admin!")

if __name__ == "__main__":
    asyncio.run(promote())