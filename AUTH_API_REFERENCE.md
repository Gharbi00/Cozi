# CoZi Auth APIs - Postman Reference

## Base URL
```
http://localhost:8080
```

## Authentication Endpoints

### 1. Login
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token for subsequent requests.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Field Validation:**
- `email` (required): Valid email format
- `password` (required): Non-empty string

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiQ1VTVE9NRVIiXSwiaWF0IjoxNjE2NDM2NDAwLCJleHAiOjE2MTY1MjI4MDB9.signature",
  "tokenType": "Bearer",
  "roles": ["CUSTOMER"],
  "userId": 1
}
```

**Response Fields:**
- `token` (string): JWT token to be used in Authorization header for protected routes
- `tokenType` (string): Always "Bearer"
- `roles` (array): User roles (e.g., CUSTOMER, ADMIN)
- `userId` (number): Unique user identifier

**Error Responses:**
- `401 Unauthorized`: Invalid email or password
- `400 Bad Request`: Missing or invalid request fields

**Usage in Postman:**
1. After successful login, copy the `token` value
2. For protected endpoints, add header:
   ```
   Authorization: Bearer {token}
   ```

---

### 2. Register
**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "roles": ["CUSTOMER"]
}
```

**Field Validation:**
- `firstName` (required): Non-empty string
- `lastName` (required): Non-empty string
- `email` (required): Valid email format
- `password` (required): Minimum 6 characters
- `roles` (optional): Array of role strings. Valid values: `CUSTOMER`, `ADMIN`
  - If not provided, defaults to `CUSTOMER`

**Success Response (200 OK):**
```json
{
  "id": 2,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "roles": ["CUSTOMER"]
}
```

**Response Fields:**
- `id` (number): Unique user identifier
- `firstName` (string): User's first name
- `lastName` (string): User's last name
- `email` (string): User's email address
- `roles` (array): Assigned roles

**Error Responses:**
- `400 Bad Request`: 
  - Invalid email format
  - Password less than 6 characters
  - Missing required fields
  - Email already exists

---

## Usage Examples

### Example 1: Complete Authentication Flow

**Step 1: Register a new user**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "password": "SecurePass123",
    "roles": ["CUSTOMER"]
  }'
```

**Step 2: Login with the new user**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "SecurePass123"
  }'
```

**Step 3: Use the token in other requests**
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer {token_from_login}"
```

---

### Example 2: Postman Collection Setup

**Setting Variables in Postman:**

1. **Base URL Variable:**
   - Variable name: `base_url`
   - Value: `http://localhost:8080`

2. **Token Variable (Dynamic):**
   - Variable name: `token`
   - Set empty initially: `""`
   - After login, update via Tests script:
     ```javascript
     if (pm.response.code === 200) {
       pm.environment.set("token", pm.response.json().token);
     }
     ```

3. **Using Variables in Requests:**
   - URL: `{{base_url}}/api/auth/login`
   - Authorization Header: `Authorization: Bearer {{token}}`

---

## Response Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid credentials) |
| 500 | Internal Server Error |

---

## Security Notes

- **Token Storage:** Store JWT tokens securely (use httpOnly cookies if possible)
- **Token Expiration:** Tokens expire after a fixed duration (check server config)
- **Password Requirements:** Minimum 6 characters (consider enforcing stronger policies)
- **HTTPS:** Use HTTPS in production, not HTTP

---

## Common Issues & Solutions

### Issue: "401 Unauthorized" on Login
**Solution:** Verify email and password are correct. Email is case-sensitive.

### Issue: "400 Bad Request" on Register
**Solution:** 
- Ensure password is at least 6 characters
- Verify email format is valid
- Check that all required fields are present

### Issue: Token not working on protected endpoints
**Solution:** 
- Verify token is included in `Authorization` header with "Bearer " prefix
- Check token hasn't expired
- Ensure token is the complete string from the response

---

## Import into Postman

1. Open Postman
2. Click **Import** (top-left corner)
3. Select **Upload Files**
4. Choose `CoZi_Auth_APIs_Postman_Collection.json`
5. Click **Import**
6. The collection will appear in your Collections sidebar

---

## Next Steps

After authentication, use the token to access protected endpoints such as:
- `GET /api/users` - List all users
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `GET /api/coliving` - List coliving units
- `GET /api/coworking` - List coworking spaces
