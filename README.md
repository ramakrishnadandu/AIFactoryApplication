# SayHi

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js CI](https://github.com/yourusername/sayhi/actions/workflows/node.js.yml/badge.svg)](https://github.com/yourusername/sayhi/actions/workflows/node.js.yml)

## Description

SayHi is a dynamic greeting application designed to send personalized greetings on festivals, birthdays, and other special occasions. It enhances user interaction by providing tailored messages via an engaging user interface.

## Features

- **User Registration**: Users can sign up to create an account.
- **User Login**: Registered users can log in to access personalized features.
- **Dynamic Greetings**: Send greetings on various events and personalize them based on user data.
- **CI/CD Pipeline Integration**: Continuous Integration and Deployment setup for seamless updates.

## Tech Stack

- **Frontend**: React
- **Backend**: Express.js
- **CI/CD**: GitHub Actions

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- Docker installed on your machine if you want to run using Docker.
- A GitHub account for CI/CD.

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/sayhi.git
   cd sayhi
   

2. **Install dependencies**

   ```bash
   npm install
   

3. **Run the application**

   ```bash
   npm start
   

4. **Navigate to**

   
   http://localhost:3000
   

## Docker Setup

To run the application using Docker:

1. **Build the Docker image**

   ```bash
   docker build -t sayhi-app .
   

2. **Run the Docker container**

   ```bash
   docker run -p 3000:3000 sayhi-app
   

## Environment Variables

| Variable Name        | Description                 | Example             |
|----------------------|-----------------------------|---------------------|
| `PORT`               | Port number for server      | `3000`              |
| `DB_HOST`            | Database host               | `localhost`         |
| `DB_USER`            | Database username           | `user`              |
| `DB_PASS`            | Database password           | `password`          |
| `JWT_SECRET`         | JWT secret for auth         | `your_jwt_secret`   |
| `NODE_ENV`           | Node environment            | `development`       |

## API Overview

- **POST /api/v1/users**: Register a new user.
- **POST /api/v1/login**: Login for existing users.

## Deployment Guide

- Ensure your project is correctly hosted on a platform such as Heroku or Vercel.
- Push changes to the `main` branch to trigger the CI/CD pipeline.
- Make sure the environment variables in your host platform are correctly set up for the application to run.

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Open a pull request.

We welcome contributions from everyone. Feel free to enhance the application or fix issues. Please follow the established code style guidelines and tests.