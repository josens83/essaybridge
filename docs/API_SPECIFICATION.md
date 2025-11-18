# EssayBridge API Specification

## Base URL
```
Production: https://api.essaybridge.com/api/v1
Development: http://localhost:3001/api/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format
```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { ... }
  }
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "name": "홍길동",
  "role": "student"
}
```

**Response:**
```json
{
  "user": {
    "id": "usr_1234567890",
    "email": "student@example.com",
    "name": "홍길동",
    "role": "student",
    "createdAt": "2025-01-15T10:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1...",
  "expiresIn": 7200
}
```

### POST /auth/login
Login existing user

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:** Same as register

### POST /auth/logout
Logout current user (invalidate tokens)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

### POST /auth/refresh
Refresh access token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1...",
  "expiresIn": 7200
}
```

### GET /auth/me
Get current user profile

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "usr_1234567890",
  "email": "student@example.com",
  "name": "홍길동",
  "role": "student",
  "profileImage": "https://cdn.essaybridge.com/avatars/...",
  "grade": 3,
  "targetUniversities": ["서울대학교", "연세대학교"],
  "interests": ["경영학과", "경제학과"],
  "subscriptionPlan": "basic",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

---

## Essay Endpoints

### GET /essays
Get all essays for current user

**Query Parameters:**
- `status` (optional): `draft`, `submitted`, `in_review`, `completed`
- `page` (default: 1)
- `limit` (default: 10)
- `sortBy` (default: `createdAt`)
- `order` (default: `desc`)

**Response:**
```json
{
  "essays": [
    {
      "id": "esy_1234567890",
      "studentId": "usr_1234567890",
      "title": "서울대 경영학과 논술",
      "content": "...",
      "university": "서울대학교",
      "department": "경영학과",
      "essayType": "university_specific",
      "status": "in_review",
      "wordCount": 1200,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T11:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

### POST /essays
Create new essay

**Request Body:**
```json
{
  "title": "서울대 경영학과 논술",
  "content": "논술 내용...",
  "university": "서울대학교",
  "department": "경영학과",
  "essayType": "university_specific"
}
```

### GET /essays/:id
Get essay by ID

### PATCH /essays/:id
Update essay

### DELETE /essays/:id
Delete essay

### POST /essays/:id/submit
Submit essay for review

**Request Body:**
```json
{
  "preferredExpertId": "exp_1234567890" // optional
}
```

### GET /essays/:id/reviews
Get all reviews for an essay

### POST /essays/upload
Upload essay file (PDF, DOC, DOCX, HWP)

**Content-Type:** `multipart/form-data`

**Response:**
```json
{
  "url": "https://cdn.essaybridge.com/essays/...",
  "filename": "essay.pdf",
  "size": 1024000
}
```

---

## Payment Endpoints

### POST /payments/create
Create payment intent

**Request Body:**
```json
{
  "planId": "plan_basic_monthly",
  "paymentMethod": "card",
  "billingPeriod": "monthly"
}
```

**Response:**
```json
{
  "paymentKey": "pay_1234567890",
  "orderId": "ord_1234567890",
  "amount": 29900,
  "paymentUrl": "https://pay.toss.im/..."
}
```

### POST /payments/confirm
Confirm payment after user completes payment

**Request Body:**
```json
{
  "paymentKey": "pay_1234567890",
  "orderId": "ord_1234567890",
  "amount": 29900
}
```

### GET /payments/history
Get payment history

### GET /subscriptions/current
Get current active subscription

### POST /subscriptions/:id/cancel
Cancel subscription

### POST /subscriptions/change-plan
Change subscription plan

---

## Course Endpoints

### GET /courses
Get all available courses

**Query Parameters:**
- `category`: `general`, `university_specific`, `writing_basics`, `analysis`
- `level`: `beginner`, `intermediate`, `advanced`
- `university`: Filter by university
- `page`, `limit`, `sortBy`, `order`

### GET /courses/:id
Get course details with lessons

### POST /courses/:id/enroll
Enroll in a course

### GET /courses/:id/progress
Get user's progress in a course

---

## Consulting Endpoints

### GET /consultants
Get available consultants

### POST /consultations/request
Request 1:1 consultation

**Request Body:**
```json
{
  "consultantId": "con_1234567890",
  "preferredDate": "2025-01-20T14:00:00Z",
  "topic": "대학 선택 전략",
  "message": "상담 요청 메시지..."
}
```

### GET /consultations
Get user's consultations

### PATCH /consultations/:id
Update consultation

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTHENTICATION_ERROR` | 401 | Invalid or expired token |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_EMAIL` | 409 | Email already registered |
| `PAYMENT_FAILED` | 402 | Payment processing failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- File uploads: 10 requests per hour

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642262400
```

---

## Webhooks

### Payment Success
```json
{
  "event": "payment.success",
  "data": {
    "orderId": "ord_1234567890",
    "userId": "usr_1234567890",
    "amount": 29900,
    "plan": "basic_monthly"
  },
  "timestamp": "2025-01-15T10:00:00Z"
}
```

### Essay Review Completed
```json
{
  "event": "review.completed",
  "data": {
    "essayId": "esy_1234567890",
    "reviewId": "rev_1234567890",
    "studentId": "usr_1234567890"
  },
  "timestamp": "2025-01-15T10:00:00Z"
}
```
