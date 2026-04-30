# Start by defining the base image for the build stage with Node and Python 3.10
FROM python:3.10-slim AS build-stage

# Set the working directory
WORKDIR /app

# Install Node.js 18 (needed for the app build) and curl for installing Node
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy Python requirements file
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# (Optional) Run tests
# RUN npm test or python -m pytest

# Start a new stage from a smaller base image for deployment
FROM nginx:alpine AS production-stage

# Copy the built application from the previous stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx configuration if any
# COPY nginx.conf /etc/nginx/nginx.conf  (uncomment and edit this line if you have a custom nginx configuration)

# Expose the port the app runs on
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]