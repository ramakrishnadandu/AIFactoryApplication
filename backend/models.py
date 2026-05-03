from django.db import models
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Example Django models for the project

class User(models.Model):
    username = models.CharField(max_length=100, unique=True, verbose_name="Username")
    email = models.EmailField(unique=True, verbose_name="Email Address")
    first_name = models.CharField(max_length=50, verbose_name="First Name")
    last_name = models.CharField(max_length=50, verbose_name="Last Name")
    date_joined = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        try:
            super(User, self).save(*args, **kwargs)
            logger.debug(f"User {self.username} saved successfully.")
        except Exception as e:
            logger.error(f"Error saving user {self.username}: {e}")
            raise

    def __str__(self):
        return self.username

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=200, verbose_name="Title")
    content = models.TextField(verbose_name="Content")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        try:
            super(Post, self).save(*args, **kwargs)
            logger.debug(f"Post '{self.title}' by user {self.user.username} saved successfully.")
        except Exception as e:
            logger.error(f"Error saving post '{self.title}' by user {self.user.username}: {e}")
            raise

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField(verbose_name="Content")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        try:
            super(Comment, self).save(*args, **kwargs)
            logger.debug(f"Comment by user {self.user.username} on post '{self.post.title}' saved successfully.")
        except Exception as e:
            logger.error(f"Error saving comment by user {self.user.username} on post '{self.post.title}': {e}")
            raise

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"
    
    class Meta:
        ordering = ['-created_at']