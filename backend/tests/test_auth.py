import pytest
import uuid

# Helper to generate unique usernames
def random_user():
    return f"user_{uuid.uuid4().hex[:8]}"

@pytest.mark.asyncio
async def test_register_user(client):
    username = random_user()
    payload = {
        "username": username,
        "password": "securepassword123"
    }
    
    response = await client.post("/api/auth/register", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == username
    assert "id" in data
    assert data["role"] == "worker"

@pytest.mark.asyncio
async def test_login_user(client):
    username = random_user()
    password = "mypassword"
    
    # 1. Register
    await client.post("/api/auth/register", json={"username": username, "password": password})

    # 2. Login
    login_data = {
        "username": username,
        "password": password
    }
    
    response = await client.post(
        "/api/auth/login", 
        data=login_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"