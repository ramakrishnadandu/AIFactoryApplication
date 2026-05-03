# Use the official Python image.
# https://hub.docker.com/_/python

FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8001 available to the world outside this container
EXPOSE 8001

# Define environment variable
ENV PYTHONUNBUFFERED=1

# The command to run the fastapi server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]