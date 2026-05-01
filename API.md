# API Documentation for Syhionce

## Overview

This document provides the details of each API endpoint available in the Syhionce application, focusing on user interest customization functionalities. All endpoints require authentication to ensure secure access.

---

## Endpoints

### 1. Get User Interests

- **Method:** GET
- **Path:** `/api/v1/user/interests`
- **Description:** Retrieves the list of interests associated with the authenticated user.
- **Authentication Required:** Yes
- **Request Body:** None
- **Response:**
  - **Status Code:** 200 OK
  - **Response Body (JSON):**
    ```json
    {
      "interests": [
        // Array of user interests
      ]
    }
    

#### Error Codes:
- **401 Unauthorized:** Authentication token is missing or invalid.
- **500 Internal Server Error:** An unexpected error occurred on the server side.

---

### 2. Update User Interests

- **Method:** POST
- **Path:** `/api/v1/user/interests`
- **Description:** Updates the list of interests for the authenticated user.
- **Authentication Required:** Yes
- **Request Body (JSON):**
  ```json
  {
    "interests": [
      // Array of new interests
    ]
  }
  
- **Response:**
  - **Status Code:** 200 OK
  - **Response Body (JSON):**
    ```json
    {
      "message": "Interests updated"
    }
    

#### Error Codes:
- **400 Bad Request:** The request body is missing or improperly formatted.
- **401 Unauthorized:** Authentication token is missing or invalid.
- **500 Internal Server Error:** An unexpected error occurred on the server side.

---

## Notes

- Ensure all requests include a valid authentication token in the headers.
- All JSON arrays of interests should match the expected format specific to your application's requirements.
- For troubleshooting errors, refer to the status code returned in the API responses.

This API documentation provides the necessary endpoints to manage user interests within the Syhionce application, supporting integration within a continuous integration and deployment workflow.