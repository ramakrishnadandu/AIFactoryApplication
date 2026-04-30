# Start by defining the base image for the build stage
FROM python:3.9-slim AS build-stage

# Install node and npm
RUN apt-get update && apt-get install -y nodejs npm && npm install -g npm@latest && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install python dependencies here if requirements.txt or similar exists
# Assuming a requirements.txt file exists in project root
RUN if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

# Build the application
RUN npm run build

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