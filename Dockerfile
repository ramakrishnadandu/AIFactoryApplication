# Use python:3.9-slim as base image to ensure Python 3.9 is installed and consistent
FROM python:3.9-slim AS build-python

# Install Node.js 18 manually
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs python3-pip python3-venv && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install node dependencies
COPY package*.json ./
RUN npm install

# Copy python requirements
COPY requirements.txt ./

# Install python dependencies and pytest
RUN pip install --no-cache-dir -r requirements.txt pytest

# Copy rest of app
COPY . .

# Build app
RUN npm run build

# Use nginx alpine for production
FROM nginx:alpine AS production-stage

COPY --from=build-python /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Note: Docker Hub login credentials should be provided in the CI/CD pipeline
# and not inside this Dockerfile. Ensure the CI pipeline performs 'docker login'
# with username and password before build or push steps.