import asyncio
import sys
import os

# Ensure we can import the app
sys.path.append(os.getcwd())

from sqlalchemy import text
from app.core.database import engine

async def fix():
    async with engine.begin() as conn:
        # Delete the user causing the error
        await conn.execute(text("DELETE FROM users WHERE username = 'admin'"))
        await conn.execute(text("DELETE FROM users WHERE username = 'worker'"))
        print("✅ Cleaned up old users.")

if __name__ == "__main__":
    asyncio.run(fix())