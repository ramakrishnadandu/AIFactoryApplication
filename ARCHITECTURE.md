# sayhi System Architecture

## System Overview

The `sayhi` application is a microservices-based dynamic greeting platform that provides users with personalized greetings for festivals, birthdays, and custom events. It leverages a series of APIs to manage users, generate greetings, integrate with external calendars, and monitor greetings via email.

+------------------+       +-------------------+      +--------------------+      
|  User Service    |<----->|  Cache Service    |<---->|  Greeting Service  |      
|  (express)       |       |  (Redis)          |      |  (express)         |
+------------------+       +-------------------+      +--------------------+
       |                                             |
       v                                             v
+-------------------+        +--------------------+
|  Event Calendar   |<------>|  Custom Greetings  |
|  Service          |        |  Service           |
|  (express)        |        |  (express)         |
+-------------------+        +--------------------+
        |                                          ^
        v                                          |
+-------------------+      +-----------------------+
|   Email Queue     |<-----|       Database        |
|  (Amazon SQS)     |      |       (MongoDB)       |
+-------------------+      +-----------------------+

## Component Descriptions

- **User Service**: Handles all operations related to user management, including registration, authentication, and profile management. Runs on Node.js with Express and uses JWT for authentication.

- **Greeting Service**: Responsible for generating and dispatching personalized greetings based on users' events. Interacts with the Email Queue to send these greetings.

- **Event Calendar Service**: Integrates with external calendar services to synchronize event data, ensuring the app keeps up-to-date with all relevant festivals and personal events.

- **Custom Greetings Service**: Allows users to create and manage their personalized greeting messages.

- **Email Queue**: Implements an Amazon SQS-based system to queue and manage the sending of emails, both for confirmations and greeting messages.

- **Cache Service**: Utilizes Redis to cache session data and greetings, enhancing performance by reducing database load.

- **Database**: Uses MongoDB to store user profiles, greeting records, and calendar entries. The database is designed to handle high-read scenarios efficiently.

## Data Flow

1. **User Registration and Authentication**: 
   - User Service handles registration and authentication requests.
   - Authentication tokens (JWT) are issued upon successful login or registration.

2. **Personalized Greeting Dispatch**:
   - Greeting Service creates personalized messages and enqueues them in the Email Queue.
   - Once queued, the messages are sent out as emails.

3. **Event Synchronization**:
   - Event Calendar Service fetches external event data and updates the MongoDB database.

4. **Custom Greetings Operations**:
   - Custom Greetings Service allows CRUD operations on user-defined greetings.
   - Changes are immediately updated in the database and cached.

5. **Caching**:
   - User session data and frequently accessed greetings are stored in Redis cache for quick retrieval.

## Database Schema

The database schema in MongoDB includes several collections such as Users, Greetings, Events, and CustomGreetings, each designed to store related information efficiently. This schema facilitates easy lookups and flexible updates, crucial for dynamic data interaction.

## Security Model

- **Authentication**: Employs JWT for secure authentication. Tokens are checked for each API request to ensure user legitimacy and session validity.
- **Encryption**: All data in transit is encrypted using TLS 1.3 to ensure privacy and data integrity over the network.

## Scalability

- **Horizontal Scaling**: The microservices architecture is inherently designed to scale horizontally. Services can be deployed across multiple instances using Kubernetes, allowing for dynamic scaling based on server load.
- **CDN**: A Content Delivery Network is employed to optimize the delivery of static content, reducing latency and enhancing user experiences globally.

## Deployment & Monitoring

- **Deployment**: The solution is deployed on AWS, utilizing Docker containers orchestrated by Kubernetes. This provides a resilient infrastructure capable of scaling with demand.
- **Continuous Integration/Continuous Deployment (CI/CD)**: Managed through GitHub Actions, ensuring rapid deployment of changes and updates to the system.
- **Monitoring**: Comprehensive monitoring strategies (potentially using CloudWatch or Prometheus) ensure the health and performance of the application services are continuously checked.