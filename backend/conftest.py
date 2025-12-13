import sys
import os
import pytest
from httpx import AsyncClient, ASGITransport

# 1. Force Python to see the 'app' folder
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from app.core.database import engine, Base
# Import models so SQLAlchemy knows they exist before creating tables
from app.models.user import User 

# 2. Database Setup Fixture (Runs before every test)
@pytest.fixture(scope="function", autouse=True)
async def setup_db():
    """
    Creates tables before each test and (optionally) drops them after.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Uncomment the next lines if you want a fresh DB for every single test (slower but cleaner)
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.drop_all)

# 3. Client Fixture (Available to all tests)
@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac