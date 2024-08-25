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

### **Failed Response Message**
```json
{
    "success": false,
    "message": "Invalid email or password"
}
```


## 3. BLOG CREATION API

**Endpoint: **POST:  `/blogs/create/`

### Description
Creates a new blog post with a title, body content, and associated images.

## Request Headers
- ```Content-Type: multipart/form-data```


## Request Body
The request body should be sent as `multipart/form-data`. This allows you to upload files along with form data.

### Fields

a. title
   - Type: `string`
   - Description: The title of the blog post.
   - Constraints: Required, cannot be empty.

b. body
   - Type: `string`
   - Description: The body content of the blog post.
   - Constraints: Required, cannot be empty.

c.images
   - Type: file
   - Description: Images to be uploaded with the blog post.
   -Constraints: 
     - Minimum 1 image
     - Maximum 10 images
     - Allowed formats: JPG, JPEG, PNG


## Response

## Success Response

- Status Code: `201 Created`
- Body: ```json
  {
    "success": true,
    "message": "Blog post created successfully!"
  }```

### Error Response

i. Validation Error

   - Status Code: `400 Bad Request`
   - Body:
     ```json
     {
       "success": false,
       "message": "Please provide the blog title."
     }
     ```
     OR
     ```json
     {
       "success": false,
       "message": "Please provide the blog body content."
     }```

ii. Image Upload Error
   - Status Code: `400 Bad Request`
   - Body:
   - ```json
     {
       "success": false,
       "message": "Please upload between 1 and 10 images."
     }```
