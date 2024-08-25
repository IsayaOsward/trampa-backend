# APIs FOR TRAMPA WEB SYSTEM

## BASE_URL
`http://localhost:3050/api/v1`

---

## 1. Registration API

**Endpoint:** `/register/`

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

### Error Message:
```json
{
  "success": false,
  "message": "ERROR MESSAGE GOES HERE"
}
```

## 2. Login API
**Endpoint** `/login/`
### **Parameters Required:**
```json
{
	"email": "isaya.osward@example.com",
 	"password": "SecureP@ssw0rd!"
}
```

### **Success Response Message**
```json
{
    "success": true,
    "data": {
        "username": "John Doe",
        "email": "johndoe@axample.com",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAYXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcyNDI2MTIxMSwiZXhwIjoxNzI0MjYyMTExfQ.LUgp5Gp3DUsa9PkE5UOnjgE7RMDUBzCYqgsnrjU3iaE",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlhdCI6MTcyNDI2MTIxMSwiZXhwIjoxNzI0MzQ3NjExfQ.eAp9j1-Ashw-GWXxmd5TVYbZOaAu-mV3P2zfYFmVfN8"
    }
}
```

### **FAILED RESPONSE MESSAGE**
```json
{
    "success": false,
    "message": "Invalid email or password"
}
```













j
