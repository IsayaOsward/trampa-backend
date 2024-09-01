# APIs FOR TRAMPA WEB SYSTEM

## BASE_URL
`http://localhost:3050/api/v1/`

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

**Endpoint:** POST:  `/blogs/create/`

### Description
Creates a new blog post with a title, body content, and associated images.

## Request Headers
- ```Content-Type: multipart/form-data```


## Request Body
The request body should be sent as `multipart/form-data`. 
This allows you to upload files along with form data.

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
   - Type: `file`
   - Description: Images to be uploaded with the blog post.
   -Constraints: 
     - Minimum 1 image
     - Maximum 10 images
     - Allowed formats: JPG, JPEG, PNG


## Response
### Success Response

- Status Code: `201 Created`
- Body:
 ```json
  {
    "success": true,
    "message": "Blog post created successfully!"
  }
  ```

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
     :
     ```json
     {
       "success": false,
       "message": "Please provide the blog body content."
     }
     ```
     
ii. Image Upload Error
   - Status Code: `400 Bad Request`
   - Body:
     ``` json
     {
       "success": false,
       "message": "Please upload between 1 and 10 images."
     }
     ```

4. ### Fetching blogs
This endpoint is used for fetching blogs related data from the database for displaying them on the frontend.
**endpoints** GET `/blogs/fetch/`
This returns all blogs in a summary mode,
## Resonse
### Success response
- Status code: `200 OK`
- Body:
  ```json
  [
    {
        "id": "7E4287D83E07D11F148A",
        "title": "My SecondPost",
        "body": "This Software Requirements Specification (SRS) document outlines the essential requirements for the development of a mobile application designed to connect users with therapists for love-related issues. By detailing the functional and non-functional requirements, user interfaces, external interfaces, and system architecture, this document serves as a comprehensive guide for all stakeholders involved in the project.\n\nThe application aims to provide a seamless and secure platform where users can seek advice from professional therapists and receive timely responses. With a focus on user experience, data security, and performance, the system is designed to meet the needs of both users and therapists effectively. The outlined requirements and architectural details ensure that the development process is well-structured, reducing the risk of miscommunication and ensuring that the final product aligns with the client's vision.\n\nMoving forward, adherence to this SRS will facilitate the successful implementation of the application, ultimately delivering a product that meets the expectations of the end-users and supports the ongoing growth and success of the service.",
        "images": "[\"1725041993209.jpg\"]",
        "created_at": "2024-08-30T18:19:53.000Z",
        "status": 0
    },
    {
        "id": "599ADF6B20E8DF33D981",
        "title": "My SecondPost",
        "body": "This Software Requirements Specification (SRS) document outlines the essential requirements for the development of a mobile application designed to connect users with therapists for love-related issues. By detailing the functional and non-functional requirements, user interfaces, external interfaces, and system architecture, this document serves as a comprehensive guide for all stakeholders involved in the project.\n\nThe application aims to provide a seamless and secure platform where users can seek advice from professional therapists and receive timely responses. With a focus on user experience, data security, and performance, the system is designed to meet the needs of both users and therapists effectively. The outlined requirements and architectural details ensure that the development process is well-structured, reducing the risk of miscommunication and ensuring that the final product aligns with the client's vision.\n\nMoving forward, adherence to this SRS will facilitate the successful implementation of the application, ultimately delivering a product that meets the expectations of the end-users and supports the ongoing growth and success of the service.",
        "images": "[\"1724812473641.PNG\",\"1724812473653.PNG\",\"1724812473656.PNG\",\"1724812473675.jpg\"]",
        "created_at": "2024-08-28T02:34:33.000Z",
        "status": 0
    },
    {
        "id": "91230E88F37A15D96C62",
        "title": "My SecondPost",
        "body": "This Software Requirements Specification (SRS) document outlines the essential requirements for the development of a mobile application designed to connect users with therapists for love-related issues. By detailing the functional and non-functional requirements, user interfaces, external interfaces, and system architecture, this document serves as a comprehensive guide for all stakeholders involved in the project.\n\nThe application aims to provide a seamless and secure platform where users can seek advice from professional therapists and receive timely responses. With a focus on user experience, data security, and performance, the system is designed to meet the needs of both users and therapists effectively. The outlined requirements and architectural details ensure that the development process is well-structured, reducing the risk of miscommunication and ensuring that the final product aligns with the client's vision.\n\nMoving forward, adherence to this SRS will facilitate the successful implementation of the application, ultimately delivering a product that meets the expectations of the end-users and supports the ongoing growth and success of the service.",
        "images": "[\"1724788163718.PNG\",\"1724788163724.PNG\",\"1724788163726.PNG\",\"1724788163734.jpg\"]",
        "created_at": "2024-08-27T19:49:23.000Z",
        "status": 0
    },
    {
        "id": "87EB5C110F4DC135932E",
        "title": "My First Blog Post",
        "body": "This Software Requirements Specification (SRS) document outlines the essential requirements for the development of a mobile application designed to connect users with therapists for love-related issues. By detailing the functional and non-functional requirements, user interfaces, external interfaces, and system architecture, this document serves as a comprehensive guide for all stakeholders involved in the project.\n\nThe application aims to provide a seamless and secure platform where users can seek advice from professional therapists and receive timely responses. With a focus on user experience, data security, and performance, the system is designed to meet the needs of both users and therapists effectively. The outlined requirements and architectural details ensure that the development process is well-structured, reducing the risk of miscommunication and ensuring that the final product aligns with the client's vision.\n\nMoving forward, adherence to this SRS will facilitate the successful implementation of the application, ultimately delivering a product that meets the expectations of the end-users and supports the ongoing growth and success of the service.",
        "images": "[\"1724577252241.PNG\",\"1724577252252.PNG\",\"1724577252253.PNG\",\"1724577252259.PNG\"]",
        "created_at": "2024-08-25T09:14:12.000Z",
        "status": 0
    },
    {
        "id": "B20DE105550386F0FFF0",
        "title": "My First Blog Post",
        "body": "This Software Requirements Specification (SRS) document outlines the essential requirements for the development of a mobile application designed to connect users with therapists for love-related issues. By detailing the functional and non-functional requirements, user interfaces, external interfaces, and system architecture, this document serves as a comprehensive guide for all stakeholders involved in the project.\n\nThe application aims to provide a seamless and secure platform where users can seek advice from professional therapists and receive timely responses. With a focus on user experience, data security, and performance, the system is designed to meet the needs of both users and therapists effectively. The outlined requirements and architectural details ensure that the development process is well-structured, reducing the risk of miscommunication and ensuring that the final product aligns with the client's vision.\n\nMoving forward, adherence to this SRS will facilitate the successful implementation of the application, ultimately delivering a product that meets the expectations of the end-users and supports the ongoing growth and success of the service.",
        "images": "[\"1724577209980.PNG\",\"1724577209990.PNG\",\"1724577209996.PNG\",\"1724577210003.PNG\"]",
        "created_at": "2024-08-25T09:13:30.000Z",
        "status": 0
    },
    {
        "id": "AB84D02F728B0DF197EE",
        "title": "My First Blog Post",
        "body": "This Software Requirements Specification (SRS) document outlines the essential requirements for the development of a mobile application designed to connect users with therapists for love-related issues. By detailing the functional and non-functional requirements, user interfaces, external interfaces, and system architecture, this document serves as a comprehensive guide for all stakeholders involved in the project.\n\nThe application aims to provide a seamless and secure platform where users can seek advice from professional therapists and receive timely responses. With a focus on user experience, data security, and performance, the system is designed to meet the needs of both users and therapists effectively. The outlined requirements and architectural details ensure that the development process is well-structured, reducing the risk of miscommunication and ensuring that the final product aligns with the client's vision.\n\nMoving forward, adherence to this SRS will facilitate the successful implementation of the application, ultimately delivering a product that meets the expectations of the end-users and supports the ongoing growth and success of the service.",
        "images": "[\"1724577047402.PNG\",\"1724577047414.PNG\",\"1724577047416.PNG\",\"1724577047430.PNG\"]",
        "created_at": "2024-08-25T09:10:47.000Z",
        "status": 0
    }
  ]
```

  
