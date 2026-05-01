# API Documentation - sayhi

## Introduction
The sayhi API provides endpoints to handle user registration, user login, and dynamic greetings. This document outlines all the available endpoints, their methods, authentication requirements, request body formats, and possible responses.

## Endpoints

### 1. User Registration

- **Method + Path**: `POST /api/v1/users`
- **Description**: This endpoint registers a new user in the sayhi application.
- **Authentication**: Not required
- **Request Body (JSON)**:

  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string"
  }
  

- **Response (JSON)**:

  ```json
  {
    "data": {
      "userId": "string"
    }
  }
  

- **Error Codes**:
  - `400`: Bad Request / Validation Error
  - `409`: Conflict / User Already Exists
  - `500`: Internal Server Error

### 2. User Login

- **Method + Path**: `POST /api/v1/login`
- **Description**: This endpoint allows a user to log into the sayhi application.
- **Authentication**: Not required
- **Request Body (JSON)**:

  ```json
  {
    "email": "string",
    "password": "string"
  }
  

- **Response (JSON)**:

  ```json
  {
    "data": {
      "token": "string"
    }
  }
  

- **Error Codes**:
  - `400`: Bad Request / Validation Error
  - `401`: Unauthorized / Invalid Credentials
  - `500`: Internal Server Error

## Notes

- All responses and requests that require data should use JSON format.
- Ensure that proper validation is performed on the client-side to prevent sending invalid data.
- Error messages should be descriptive enough to guide the client on the required action.
- Future versions may introduce authentication on certain endpoints as user data and security needs grow.

## Conclusion

This API provides the core functionalities required for basic user management and dynamic greetings in the sayhi application. Integration of a CI/CD pipeline is planned for automated deployments and testing.