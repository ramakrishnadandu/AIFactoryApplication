# Use python:3.10 as base image to ensure availability
FROM python:3.10 AS build-python

# Install Node.js 18 manually
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy package files and install node dependencies
COPY package*.json ./
RUN npm install

# Copy python requirements
COPY requirements.txt ./
# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

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