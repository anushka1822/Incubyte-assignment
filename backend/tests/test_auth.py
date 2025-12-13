import pytest

@pytest.mark.asyncio
async def test_register_user(client):
    """
    Test registering a new user (worker role by default).
    """
    payload = {
        "username": "testworker",
        "password": "securepassword123"
    }
    
    # Attempt registration
    response = await client.post("/api/auth/register", json=payload)
    
    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testworker"
    assert "id" in data
    assert data["role"] == "worker"
    assert "password" not in data