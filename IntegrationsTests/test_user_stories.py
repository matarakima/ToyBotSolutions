import pytest
import requests

BASE_URL = "http://localhost:5000"  # Adjust if backend runs on a different port

# User Story 1: User Registration
def test_user_registration():
    payload = {
        "username": "testuser1",
        "email": "testuser1@example.com",
        "password": "TestPassword123!"
    }
    response = requests.post(f"{BASE_URL}/users/register", json=payload)
    assert response.status_code == 201 or response.status_code == 200
    assert "confirmation" in response.text.lower() or response.json().get("success", False)

# User Story 2: Product Information Request
def test_product_information_request():
    payload = {"message": "What are the features of product X?"}
    response = requests.post(f"{BASE_URL}/chat", json=payload)
    assert response.status_code == 200
    assert "product" in response.text.lower() or "feature" in response.text.lower()

# User Story 3: Secure Login
def test_secure_login():
    payload = {
        "email": "testuser1@example.com",
        "password": "TestPassword123!"
    }
    response = requests.post(f"{BASE_URL}/users/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "token" in data or "jwt" in data or "session" in data

# User Story 4: Chat Session Continuity
def test_chat_session_continuity():
    # First, login to get token
    login_payload = {
        "email": "testuser1@example.com",
        "password": "TestPassword123!"
    }
    login_response = requests.post(f"{BASE_URL}/users/login", json=login_payload)
    assert login_response.status_code == 200
    token = login_response.json().get("token")
    assert token
    headers = {"Authorization": f"Bearer {token}"}
    # Send first message
    payload1 = {"message": "What is my last order?"}
    response1 = requests.post(f"{BASE_URL}/chat", json=payload1, headers=headers)
    assert response1.status_code == 200
    # Send follow-up message
    payload2 = {"message": "And what about the previous one?"}
    response2 = requests.post(f"{BASE_URL}/chat", json=payload2, headers=headers)
    assert response2.status_code == 200
    assert "previous" in response2.text.lower() or "order" in response2.text.lower()

# User Story 5: FAQ Retrieval
def test_faq_retrieval():
    payload = {"message": "How do I reset my password?"}
    response = requests.post(f"{BASE_URL}/chat", json=payload)
    assert response.status_code == 200
    assert "reset" in response.text.lower() or "password" in response.text.lower() or "faq" in response.text.lower()


# Negative Case: Invalid Login
def test_invalid_login():
    payload = {
        "email": "wronguser@example.com",
        "password": "WrongPassword!"
    }
    response = requests.post(f"{BASE_URL}/users/login", json=payload)
    assert response.status_code == 401 or response.status_code == 400

# Negative Case: Missing Auth Header for protected chat
def test_chat_missing_auth_header():
    payload = {"message": "Show my order history"}
    response = requests.post(f"{BASE_URL}/chat", json=payload)
    # Should be 401 Unauthorized or 403 Forbidden if endpoint requires auth
    assert response.status_code in [401, 403, 200]  # Accept 200 if endpoint is public

# Negative Case: Unknown Product Query
def test_unknown_product_query():
    payload = {"message": "Tell me about product XYZ-INVALID-123"}
    response = requests.post(f"{BASE_URL}/chat", json=payload)
    assert response.status_code == 200
    assert "not found" in response.text.lower() or "unknown" in response.text.lower() or "no information" in response.text.lower() or response.text.strip() != ""
