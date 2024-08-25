# APIs FOR TRAMPA WEB SYSTEM

## BASE_URL
`http://localhost:3050`

---

## 1. Registration API

**Endpoint:** `BASE_URL/api/v1/register/`

### **Parameters Required:**

```json
{
  "first_name": "Isaya",
  "lastname": "Osward",
  "gender": "Male",
  "phone_number": "0755957514",
  "email": "isaya.osward@example.com",
  "password": "SecureP@ssw0rd!",
  "role": "admin" // Optional, defaults to "user" if not provided
}

```
### Success Response Message:
```json
{
  "data": {
    "success": true,
    "message": "User registered successfully"
  }
}
```
