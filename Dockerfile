# Start by defining the base image for the build stage
FROM node:18 AS build-stage

# Add community repository and update apk indexes for python3.10 installation
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && apk update

# Install python3.10 and pip3 explicitly to meet package requirements
RUN apk add --no-cache python3=3.10.12-r0 py3-pip

# Set python3 as default python
RUN ln -sf python3 /usr/bin/python

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
RUN if [ -f requirements.txt ]; then pip3 install -r requirements.txt; fi

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