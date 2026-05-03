# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install --only=production

# Bundle app source code inside the container
COPY . .

# Define environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 8002

# Run the application
CMD ["node", "server.js"]