# API Documentation

## Overview

This document provides detailed information about the API endpoints for the Project application. The API is built using FastAPI and interacts with a front-end implemented with React.

---

## Endpoints

### 1. User Authentication

#### POST /auth/login
- **Description:** Authenticate user and return a token.
- **Auth Required:** No
- **Request Body (JSON):**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  
- **Response (JSON):**
  ```json
  {
    "token": "string"
  }
  
- **Error Codes:**
  - `400`: Invalid credentials.

#### POST /auth/register
- **Description:** Register a new user.
- **Auth Required:** No
- **Request Body (JSON):**
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string"
  }
  
- **Response (JSON):**
  ```json
  {
    "id": "uuid",
    "username": "string",
    "email": "string"
  }
  
- **Error Codes:**
  - `400`: User already exists.
  - `422`: Validation error.

### 2. User Management

#### GET /users/me
- **Description:** Retrieve logged-in user's profile.
- **Auth Required:** Yes
- **Request Body (JSON):** None
- **Response (JSON):**
  ```json
  {
    "id": "uuid",
    "username": "string",
    "email": "string"
  }
  
- **Error Codes:**
  - `401`: Unauthorized.

#### PUT /users/me
- **Description:** Update logged-in user's profile.
- **Auth Required:** Yes
- **Request Body (JSON):**
  ```json
  {
    "username": "string",
    "email": "string"
  }
  
- **Response (JSON):**
  ```json
  {
    "id": "uuid",
    "username": "string",
    "email": "string"
  }
  
- **Error Codes:**
  - `400`: Invalid input.
  - `401`: Unauthorized.

### 3. Project Management

#### GET /projects
- **Description:** Retrieve a list of all projects.
- **Auth Required:** Yes
- **Request Body (JSON):** None
- **Response (JSON):**
  ```json
  [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "owner": "string"
    }
  ]
  
- **Error Codes:**
  - `401`: Unauthorized.

#### POST /projects
- **Description:** Create a new project.
- **Auth Required:** Yes
- **Request Body (JSON):**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  
- **Response (JSON):**
  ```json
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "owner": "string"
  }
  
- **Error Codes:**
  - `400`: Invalid input.
  - `401`: Unauthorized.

#### PUT /projects/{project_id}
- **Description:** Update an existing project.
- **Auth Required:** Yes
- **Request Body (JSON):**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  
- **Response (JSON):**
  ```json
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "owner": "string"
  }
  
- **Error Codes:**
  - `400`: Invalid input.
  - `401`: Unauthorized.
  - `404`: Project not found.

#### DELETE /projects/{project_id}
- **Description:** Delete a project.
- **Auth Required:** Yes
- **Request Body (JSON):** None
- **Response (JSON):**
  ```json
  {
    "detail": "Project deleted successfully."
  }
  
- **Error Codes:**
  - `401`: Unauthorized.
  - `404`: Project not found.

### 4. Task Management

#### GET /projects/{project_id}/tasks
- **Description:** Retrieve all tasks for a specific project.
- **Auth Required:** Yes
- **Request Body (JSON):** None
- **Response (JSON):**
  ```json
  [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "status": "string"
    }
  ]
  
- **Error Codes:**
  - `401`: Unauthorized.
  - `404`: Project not found.

#### POST /projects/{project_id}/tasks
- **Description:** Create a new task within a project.
- **Auth Required:** Yes
- **Request Body (JSON):**
  ```json
  {
    "title": "string",
    "description": "string",
    "status": "string"
  }
  
- **Response (JSON):**
  ```json
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "status": "string"
  }
  
- **Error Codes:**
  - `400`: Invalid input.
  - `401`: Unauthorized.
  - `404`: Project not found.

#### PUT /projects/{project_id}/tasks/{task_id}
- **Description:** Update an existing task within a project.
- **Auth Required:** Yes
- **Request Body (JSON):**
  ```json
  {
    "title": "string",
    "description": "string",
    "status": "string"
  }
  
- **Response (JSON):**
  ```json
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "status": "string"
  }
  
- **Error Codes:**
  - `400`: Invalid input.
  - `401`: Unauthorized.
  - `404`: Task not found.

#### DELETE /projects/{project_id}/tasks/{task_id}
- **Description:** Delete a task from a project.
- **Auth Required:** Yes
- **Request Body (JSON):** None
- **Response (JSON):**
  ```json
  {
    "detail": "Task deleted successfully."
  }
  
- **Error Codes:**
  - `401`: Unauthorized.
  - `404`: Task not found.

---

## Error Handling

All endpoints return a standard error response in the following format:

{
  "detail": "Error description."
}
Ensure to handle these error responses appropriately within your application to provide a seamless user experience.