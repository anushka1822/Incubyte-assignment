import pytest
import uuid
from sqlalchemy import text
from app.core.database import engine

def random_user():
    return f"admin_{uuid.uuid4().hex[:8]}"

@pytest.mark.asyncio
async def test_create_sweet(client):
    username = random_user()
    password = "password"
    
    # 1. Register (Default is 'worker')
    await client.post("/api/auth/register", json={"username": username, "password": password})
    
    # 2. FORCE PROMOTE TO ADMIN (Direct DB hack for testing)
    async with engine.begin() as conn:
        await conn.execute(text(f"UPDATE users SET role = 'admin' WHERE username = '{username}'"))

    # 3. Login (Now as Admin)
    login_res = await client.post(
        "/api/auth/login", 
        data={"username": username, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = login_res.json()["access_token"]
    
    # 4. Create Sweet
    payload = {
        "name": "Chocolate Lava",
        "category": "Cake",
        "price": 5.99,
        "quantity": 10
    }
    
    response = await client.post(
        "/api/sweets/", 
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Chocolate Lava"
    assert "id" in data

@pytest.mark.asyncio
async def test_list_sweets(client):
    # 1. Get list of sweets (Public endpoint)
    response = await client.get("/api/sweets/")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)