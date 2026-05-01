# ARCHITECTURE.md

## System Overview

The `syhionce` project is designed to offer users the ability to customize their interests. The system employs a microservices architecture and benefits from a Continuous Integration and Deployment (CI/CD) pipeline for streamlined development and deployment processes. Below is a high-level ASCII diagram illustrating the overall system structure:

             +-------------------+
             |     Frontend      |
             | (React, Port 3000)|
             +--------+----------+
                      |
            REST      |                   MQ
                      v
             +--------+----------+
             |    Auth Service   |<-------------------+
             | (Express.js, 8001)|   Notification     |
             +--------+----------+      Queue         |
                      |                (AWS SQS)      |
                      v------------------+            |
                  REST|                   \           |
             +--------+----------+         \----------+
             |    User Service   |
             | (Express.js, 8000)|
             +--------+----------+
               |         |        \
              /          |         \
      REST   /       REST|          \
            v            v           \ MQ
      +-----+----+  +-----+----+      v
      |  MongoDB |  |  Redis   |   +------+
      |  (27017) |  | Cache    |<--| User |
      +----------+  | (6379)   |   +------+
                    +----------+

## Component Descriptions

1. **Frontend (React)**
   - **Type**: Service
   - **Responsibility**: Provides the user interface and manages client-side logic.
   - **Port**: 3000

2. **Auth Service (Express.js)**
   - **Type**: Service
   - **Responsibility**: Handles user authentication and session management.
   - **Port**: 8001

3. **User Service (Express.js)**
   - **Type**: Service
   - **Responsibility**: Manages user profiles and interests.
   - **Port**: 8000

4. **MongoDB**
   - **Type**: Database
   - **Responsibility**: Stores user data and their interests.
   - **Port**: 27017

5. **Redis Cache**
   - **Type**: Cache
   - **Responsibility**: Caches frequently accessed user data to improve performance.
   - **Port**: 6379

6. **Notification Queue (Amazon SQS)**
   - **Type**: Queue
   - **Responsibility**: Manages asynchronous notification tasks.
   - **Port**: 0 (Managed by AWS)

## Data Flow

1. **Frontend to Auth Service**: Uses REST protocol to send user credentials.
2. **Auth Service to User Service**: Authenticates users and utilizes REST to send a session token.
3. **User Service to MongoDB**: RESTful communication to store or retrieve user interest data.
4. **Redis Cache and Notification Queue**: REST is used for caching operations, while an MQ (Message Queue) manages notification tasks asynchronously.

## Database Schema

The primary database is MongoDB and additional data stored in Redis Cache for performance improvement:

- **MongoDB**:
  - **Collections**: `users`, `interests`
  - **Sample Document**:
    ```json
    {
      "_id": "userId123",
      "username": "john_doe",
      "email": "john@example.com",
      "interests": ["coding", "music", "gaming"]
    }
    

## Security Model

- **Authentication**: Utilizes JSON Web Tokens (JWT) to validate user sessions.
- **Encryption**: TLS 1.3 is used for encrypting data in transit.
- **Data Integrity**: Critical paths are secured using encryption and authenticated requests.

## Scalability

- **Horizontal Scaling**: Enabled for front-end and microservices to manage increased load.
- **Content Delivery Network (CDN)**: Employed to serve static assets efficiently and reduce latency globally.
- **CI/CD**: Implemented via GitHub Actions to automate testing and deployment pipelines.

## Deployment

- **Infrastructure**: Hosted on AWS with scalable cloud resources.
- **Containerization**: Docker and Kubernetes are used for orchestration and container management.

## Monitoring and Observability

- **Application Performance Management (APM)**: New Relic is used for monitoring application performance.
- **Logging**: Structured logging is employed to track system events and errors for improved debug capabilities.

The architecture is designed to ensure reliability, performance, and the ability to scale according to user demand. The use of microservices allows independent development and deployment, fostering a robust ecosystem for handling user interests efficiently.