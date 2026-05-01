# API Documentation for Project SayHi

Welcome to the API documentation for SayHi, a dynamic greeting app that coordinates wishes on festivals and birthdays. This document details all available endpoints, including required authentication, request structures, successful response formats, and error codes.

## Endpoints

### 1. User Registration

- **Endpoint**: `/api/v1/users`
- **Method**: POST
- **Description**: Register a new user for the SayHi platform.
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "user_id": "string"
  }
  
- **Error Codes**:
  - `400`: Invalid input data
  - `409`: Email already exists

### 2. Fetch Personalized Greetings

- **Endpoint**: `/api/v1/greetings`
- **Method**: GET
- **Description**: Retrieve a list of personalized greetings for the authenticated user.
- **Authentication Required**: Yes
- **Request Body**: N/A
- **Response**:
  ```json
  {
    "greetings": [
      {
        "id": "string",
        "message": "string",
        "date": "string"
      }
    ]
  }
  
- **Error Codes**:
  - `401`: Unauthorized

### 3. Event Calendar Integration

- **Endpoint**: `/api/v1/event_calendar`
- **Method**: GET
- **Description**: Access the user's event calendar with upcoming festivals and birthdays.
- **Authentication Required**: Yes
- **Request Body**: N/A
- **Response**:
  ```json
  {
    "events": [
      {
        "event_id": "string",
        "name": "string",
        "date": "string",
        "type": "string"
      }
    ]
  }
  
- **Error Codes**:
  - `401`: Unauthorized

### 4. Create Custom Greetings

- **Endpoint**: `/api/v1/custom_greetings`
- **Method**: POST
- **Description**: Allows authenticated users to create custom greetings.
- **Authentication Required**: Yes
- **Request Body**:
  ```json
  {
    "message": "string",
    "for_date": "string"
  }
  
- **Response**:
  ```json
  {
    "message": "Custom greeting created successfully"
  }
  
- **Error Codes**:
  - `400`: Invalid input data
  - `401`: Unauthorized

### 5. Email Queue Management

- **Endpoint**: `/api/v1/email_queue`
- **Method**: POST
- **Description**: Queue emails for sending greetings.
- **Authentication Required**: Yes
- **Request Body**:
  ```json
  {
    "email": "string",
    "subject": "string",
    "body": "string"
  }
  
- **Response**:
  ```json
  {
    "status": "Email queued successfully"
  }
  
- **Error Codes**:
  - `400`: Invalid input data
  - `401`: Unauthorized

This documentation provides a comprehensive overview of all endpoint functionalities available in SayHi. Ensure to handle error responses appropriately and confirm authentication where required.