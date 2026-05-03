import pika
import logging
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RabbitMQManager:
    def __init__(self):
        # Load RabbitMQ configuration from environment variables
        self.rabbitmq_host = os.getenv('RABBITMQ_HOST', 'localhost')
        self.rabbitmq_port = int(os.getenv('RABBITMQ_PORT', 5672))
        self.rabbitmq_user = os.getenv('RABBITMQ_USER', 'guest')
        self.rabbitmq_password = os.getenv('RABBITMQ_PASSWORD', 'guest')
        self.queue_name = os.getenv('QUEUE_NAME', 'default_queue')

        # Initialize RabbitMQ connection and channel
        self.connection = None
        self.channel = None
        self.connect()

    def connect(self):
        try:
            credentials = pika.PlainCredentials(self.rabbitmq_user, self.rabbitmq_password)
            parameters = pika.ConnectionParameters(
                host=self.rabbitmq_host,
                port=self.rabbitmq_port,
                credentials=credentials
            )
            self.connection = pika.BlockingConnection(parameters)
            self.channel = self.connection.channel()
            self.channel.queue_declare(queue=self.queue_name, durable=True)
            logger.info("Connected to RabbitMQ and declared queue: %s", self.queue_name)
        except Exception as e:
            logger.error("Failed to connect to RabbitMQ: %s", e)

    def publish(self, message):
        if not self.channel or self.channel.is_closed:
            self.connect()
        try:
            self.channel.basic_publish(
                exchange='',
                routing_key=self.queue_name,
                body=message,
                properties=pika.BasicProperties(
                    delivery_mode=2,  # make message persistent
                ))
            logger.info("Message published to queue %s: %s", self.queue_name, message)
        except Exception as e:
            logger.error("Failed to publish message: %s", e)

    def consume(self, callback):
        if not self.channel or self.channel.is_closed:
            self.connect()
        try:
            def on_message(channel, method, properties, body):
                logger.info("Received message: %s", body)
                try:
                    callback(body)
                    channel.basic_ack(delivery_tag=method.delivery_tag)
                except Exception as e:
                    logger.error("Failed to process message: %s", e)
                    channel.basic_nack(delivery_tag=method.delivery_tag)

            self.channel.basic_qos(prefetch_count=1)
            self.channel.basic_consume(queue=self.queue_name, on_message_callback=on_message)
            logger.info("Started consuming from queue: %s", self.queue_name)
            self.channel.start_consuming()
        except Exception as e:
            logger.error("Error consuming messages: %s", e)
            self.connection.close()

    def close(self):
        if self.connection and not self.connection.is_closed:
            self.connection.close()
            logger.info("RabbitMQ connection closed")

# Example usage:
# rabbitmq_manager = RabbitMQManager()
# rabbitmq_manager.publish("Hello, World!")
# rabbitmq_manager.consume(lambda body: print(f"Processed message: {body}"))
# rabbitmq_manager.close()