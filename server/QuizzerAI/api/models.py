from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.base_user import BaseUserManager
import uuid

# Create your models here.


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a user with the given email and password.
        """
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_unusable_password()
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        if not email:
            raise ValueError("An email is required")
        if not password:
            raise ValueError("An password is required")
        
        email = self.normalize_email(email)
        user = self.create_user(email,password)
        user.is_superuser = True
        user.save()
        return user
        
class CustomQuizManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a user with the given email and password.
        """
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_unusable_password()
        user.save()
        return user

class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100,blank=True)
    last_name = models.CharField(max_length=100,blank=True)
    image_url = models.CharField(max_length=300,blank=True)
    password = None

    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = [first_name, last_name]    
    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
class Quiz(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    createdAt = models.DateTimeField(default=timezone.now)  # Temporary default
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    fileKey = models.CharField(max_length=100,null=True)  # Consider using models.FileField if you handle file uploads
    fileName = models.CharField(max_length=1000,null=True)
    quizType = models.CharField(max_length=20,null=True)
    content = models.JSONField(blank=False, null=False, default=dict)  # Use dict as the default callable

    def __str__(self):
        return self.title
    
class StudyDoc(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    flashcard_content = models.JSONField(blank=True, null=True)
    multiple_choice_options = models.JSONField(blank=True, null=True)  # Store options as JSON
    summary_content = models.TextField(blank=True, null=True)
    objects = models.Manager()
    
    def __str__(self):
        return self.id




