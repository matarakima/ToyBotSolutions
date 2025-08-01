# User Stories

## 👤 User Story 1: User Registration
**Persona**: New Customer  
**Story**: As a new customer, I want to register as a new user so that I can access the Chatbot functionalities.  
**Benefit**: Tracks user data and enables further securing.  
**Acceptance Criteria**:  
- User is registered.  
- User provides registration information.  
- System returns registration confirmation.  
**Endpoint**: `POST /users/register`

## 📋 User Story 2: Product Information Request
**Persona**: Prospective Buyer  
**Story**: As a shopper, I want to ask the chatbot about product features so I can decide whether to buy it.  
**Benefit**: Helps users make informed purchase decisions.  
**Acceptance Criteria**:  
- Chatbot responds with accurate, relevant product details.  
- Context is retrieved from the knowledge base.  
**Endpoint**: `POST /chat`

## 🔐 User Story 3: Secure Login
**Persona**: Registered User  
**Story**: As a user, I want to log in securely so that I can access my personal order history.  
**Benefit**: Protects user data and enables personalized service.  
**Acceptance Criteria**:  
- Login requires valid credentials.  
- JWT or session cookie is issued.  
**Endpoint**: `POST /users/login`

## 💬 User Story 4: Chat Session Continuity
**Persona**: Frequent User  
**Story**: As a user, I want the chatbot to remember my previous questions during a session so I don't have to repeat myself.  
**Benefit**: Improves user experience and efficiency.  
**Acceptance Criteria**:  
- Session context is maintained.  
- Chatbot references earlier messages.  
**Endpoint**: `POST /chat` (with session token)

## ❓ User Story 5: FAQ Retrieval
**Persona**: New Customer  
**Story**: As a new user, I want to ask common questions and get instant answers from the chatbot.  
**Benefit**: Reduces support load and improves onboarding.  
**Acceptance Criteria**:  
- Chatbot retrieves relevant FAQ entries.  
- Answers are accurate and concise.  
**Endpoint**: `POST /chat` (with RAG logic)