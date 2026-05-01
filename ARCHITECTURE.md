# ARCHITECTURE.md

## System Overview

The `sayhi` application is designed as a microservices architecture, allowing the separation of concerns and ease of scaling each component independently. Below is a high-level overview of the system architecture:

+----------------+        +-----------------+
| Frontend (React)|        | CacheService    |
|                |        | (Redis)         |
+--------+-------+        +---------+-------+
         |                          |
         | REST                     | REST
         v                          v
+--------+--------+    +-------------+-------------+
| UserService    |    | GreetingService          |
| (Express)      |    | (Express)                |
+--------+-------+    +-------------+-------------+
         |                          |
         | REST                     | REST
         v                          v
+--------+--------+        +--------+--------+
| UserDB (PostgreSQL)|     | NotificationQueue |
|                   |     | (Amazon SQS)      |
+---------+---------+     +--------+---------+
          |                           |
          | REST                      | MQ
          v                           v
+---------+---------+        +--------+---------+
| EmailService     |        | NotificationQueue |
| (Express)        |        |                  |
+------------------+        +------------------+

## Component Descriptions

1. **Frontend (React)**: Provides the user interface and sends HTTP requests to the backend services.
   
2. **UserService (Express)**: Handles user authentication (registration and login), validates user credentials, and interacts with the `UserDB`.

3. **GreetingService (Express)**: Generates personalized greeting messages based on user data retrieved from `UserDB`.

4. **EmailService (Express)**: Manages the sending of emails, including registration confirmations and greeting messages. It interacts with `NotificationQueue` to ensure messages are reliably sent.

5. **UserDB (PostgreSQL)**: Stores user data, including credentials and profile information.

6. **NotificationQueue (Amazon SQS)**: A queue that holds email tasks to ensure reliable delivery and to decouple the `EmailService` from the `UserService`.

7. **CacheService (Redis)**: Caches frequently accessed data related to user sessions and preferences to speed up API responses.

## Data Flow

Each interaction within the system is delineated by specific data flows:

- **Frontend** interacts with **UserService** through RESTful APIs for user registration and login.
- **UserService** communicates with **UserDB** to store and authenticate user credentials.
- **UserService** sends requests to **EmailService** for sending email notifications upon registration or other events.
- **GreetingService** fetches user details from **UserDB** to create personalized greetings.
- **EmailService** utilizes **NotificationQueue** to send out emails asynchronously.
- **NotificationQueue** processes and forwards email tasks to **EmailService** for execution.

## Database Schema

### UserDB (PostgreSQL)

- **Users Table**:
  - `id`: UUID (Primary Key)
  - `username`: VARCHAR(255)
  - `email`: VARCHAR(255)
  - `password`: VARCHAR(255) (hashed)
  - `created_at`: TIMESTAMPTZ
  - `updated_at`: TIMESTAMPTZ

## Security Model

- **Authentication**: JSON Web Tokens (JWT) are used for user authentication, securing API endpoints.
- **Encryption**: All communications are encrypted using TLS 1.3 to ensure data integrity and privacy.

## Scalability

- **Horizontal Scaling**: Each service can be independently scaled out horizontally across multiple nodes to handle increased load.
- **CDN Integration**: Serving static assets via a Content Delivery Network (CDN) to reduce latency and increase application speed.

## Deployment and CI/CD Pipeline

- **Deployment Environment**: The application is containerized using Docker, orchestrated with Kubernetes, and deployed on AWS.
- **CI/CD Pipeline**: GitHub Actions is used to automate the testing, building, and deployment of the application to ensure rapid and reliable delivery.

## Monitoring and Logging

- **Application Performance Monitoring (APM)**: New Relic is used to monitor application performance, providing insights into app behavior and alerting on issues.
- **Structured Logging**: Logs are structured and centralized to aid in debugging and monitoring system activities.

This document provides a comprehensive overview of the architecture, components, and strategies employed in the `sayhi` application. Each piece of the system is designed to be resilient, scalable, and efficient to meet the demands of dynamic greeting functionalities.