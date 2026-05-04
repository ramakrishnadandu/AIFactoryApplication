# A complete Dockerfile for deploying the User Service of the sleepless project
FROM node:16-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy app source code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Define healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["node", "server.js"]