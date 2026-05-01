# Dockerfile for UserService

# Use the official Node.js LTS image as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Specify the OpenAPI spec file for documentation purposes
COPY openapi.yaml ./docs/

# Expose port the app runs on
EXPOSE 8000

# Start the User Service
CMD ["node", "src/userService.js"]

# Dockerfile for GreetingService

# Use the official Node.js LTS image as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose port the app runs on
EXPOSE 8001

# Start the Greeting Service
CMD ["node", "src/greetingService.js"]

# Dockerfile for EmailService

# Use the official Node.js LTS image as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose port the app runs on
EXPOSE 8002

# Start the Email Service
CMD ["node", "src/emailService.js"]

# General guidelines on using Alpine-based Node.js images:
# Ensure that the application doesn't depend on features not supported by the minimal Alpine image,
# as it might require additional package installations. Consider using alpine image's package manager,
# apk, for any missing packages.