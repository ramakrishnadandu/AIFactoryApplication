# SayHi

![GitHub license](https://img.shields.io/github/license/yourusername/sayhi)
![GitHub contributors](https://img.shields.io/github/contributors/yourusername/sayhi)
![GitHub stars](https://img.shields.io/github/stars/yourusername/sayhi)
![GitHub issues](https://img.shields.io/github/issues/yourusername/sayhi)

SayHi is a dynamic greeting application that personalizes your festival and birthday wishes. It smoothly integrates user data, event calendars, and allows custom greetings, making every occasion special.

## Features

- **User Registration**: Seamless and secure user sign-up and login.
- **Personalized Greetings**: Tailor-made wishes based on user preferences and important dates.
- **Event Calendar Integration**: Sync with calendars to never miss an important event.
- **Custom Greetings**: Create and send unique message templates for your loved ones.

## Tech Stack

- **Frontend**: React
- **Backend**: Express
- **Database**: MongoDB
- **Containerization**: Docker
- **Version Control**: Git
- **Package Manager**: NPM

## Prerequisites

- Node.js v14.x or higher
- npm v6.x or higher
- Docker (optional, for containerized setup)

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/sayhi.git
   cd sayhi
   

2. **Install dependencies**

   ```bash
   npm install
   

3. **Set up environment variables**

   Create a `.env` file in the root directory and configure your variables.

4. **Run the application**

   ```bash
   npm start
   

   The app will be available at `http://localhost:3000`.

## Docker Setup

1. **Build Docker image**

   ```bash
   docker build -t sayhi-app .
   

2. **Run Docker container**

   ```bash
   docker run -p 3000:3000 sayhi-app
   

   Access the application at `http://localhost:3000`.

## Environment Variables

| Variable            | Description                      |
|---------------------|----------------------------------|
| `PORT`              | Port number to run the server    |
| `MONGODB_URI`       | MongoDB connection string        |
| `JWT_SECRET`        | Secret key for JWT authentication|
| `EMAIL_SERVICE_API` | API key for email service        |
| `FRONTEND_URL`      | URL of the frontend app          |

## API Overview

- **`POST /api/v1/users/register`**: Register a new user.
- **`POST /api/v1/users/login`**: Authenticate a user.
- **`GET /api/v1/greetings/{userId}`**: Retrieve all greetings for a user.
- **`GET /api/v1/event_calendar`**: Access integrated events.
- **`POST /api/v1/custom_greetings/{userId}`**: Create a custom greeting.
- **`POST /api/v1/email_queue/send`**: Queue emails for sending.

## Deployment Guide

1. Ensure all environment variables are set correctly for production.
2. Build the project:

   ```bash
   npm run build
   

3. Start the production server:

   ```bash
   npm run start:prod
   

4. For Docker, push the image to a registry and deploy using your preferred DevOps tools or hosting service.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

Please ensure your code is well-documented and includes test coverage for new functionality.