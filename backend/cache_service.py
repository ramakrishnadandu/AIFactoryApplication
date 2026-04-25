import redis
import logging
import os
from typing import Optional
from redis.exceptions import RedisError
from dotenv import load_dotenv

class RedisCacheService:
    def __init__(self):
        load_dotenv()  # Load environment variables from .env file if present
        self.redis_host = os.getenv('REDIS_HOST', 'localhost')
        self.redis_port = int(os.getenv('REDIS_PORT', 6379))
        self.redis_password = os.getenv('REDIS_PASSWORD', None)
        
        self.redis_client = redis.StrictRedis(
            host=self.redis_host,
            port=self.redis_port,
            password=self.redis_password,
            decode_responses=True
        )
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        self.logger.info("RedisCacheService initialized")

    def set(self, key: str, value: str, ttl: Optional[int] = None) -> None:
        try:
            if ttl:
                self.redis_client.setex(key, ttl, value)
                self.logger.debug(f"Set key {key} with TTL of {ttl} seconds")
            else:
                self.redis_client.set(key, value)
                self.logger.debug(f"Set key {key} without TTL")
        except RedisError as e:
            self.logger.error(f"Failed to set key {key} in Redis: {e}")

    def get(self, key: str) -> Optional[str]:
        try:
            value = self.redis_client.get(key)
            self.logger.debug(f"Get key {key} with value {value}")
            return value
        except RedisError as e:
            self.logger.error(f"Failed to get key {key} from Redis: {e}")
            return None

    def delete(self, key: str) -> None:
        try:
            self.redis_client.delete(key)
            self.logger.debug(f"Deleted key {key} from Redis")
        except RedisError as e:
            self.logger.error(f"Failed to delete key {key} from Redis: {e}")

    def flush_all(self) -> None:
        try:
            self.redis_client.flushall()
            self.logger.info("Flushed all keys in Redis")
        except RedisError as e:
            self.logger.error(f"Failed to flush Redis: {e}")

    def exists(self, key: str) -> bool:
        try:
            exists = self.redis_client.exists(key)
            self.logger.debug(f"Key {key} exists: {exists}")
            return exists > 0
        except RedisError as e:
            self.logger.error(f"Failed to check existence of key {key} in Redis: {e}")
            return False

    def increment(self, key: str, amount: int = 1) -> Optional[int]:
        try:
            new_value = self.redis_client.incr(key, amount)
            self.logger.debug(f"Incremented key {key} by {amount}, new value is {new_value}")
            return new_value
        except RedisError as e:
            self.logger.error(f"Failed to increment key {key} in Redis: {e}")
            return None

    def set_if_not_exists(self, key: str, value: str) -> bool:
        try:
            was_set = self.redis_client.setnx(key, value)
            self.logger.debug(f"Set key {key} if not exists: {was_set}")
            return was_set
        except RedisError as e:
            self.logger.error(f"Failed to set key {key} if not exists in Redis: {e}")
            return False

if __name__ == "__main__":
    cache_service = RedisCacheService()
    # Example usage
    cache_service.set('example', 'test', ttl=30)
    print(cache_service.get('example'))
    cache_service.delete('example')