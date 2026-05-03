# Use python:3.9 as base image to match cache for python
FROM python:3.9 AS build-python

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