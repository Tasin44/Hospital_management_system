from django.db import models
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.contrib.auth.models import AbstractUser
from django.db import models
# from rest_framework.permissions import BasePermission
from django.conf import settings
import uuid

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        # ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient')
    )
    
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, null=False, blank=False)
    
    def is_doctor(self):
        return self.user_type == 'doctor'
    
    def is_patient(self):
        return self.user_type == 'patient'
    
    # def is_admin(self):
    #     return self.user_type == 'admin'
        # Override the save method
    def save(self, *args, **kwargs):
        if self.user_type:  # Ensure user_type is provided
            self.user_type = self.user_type.lower()  # Convert to lowercase
        # if self.is_superuser:
        #     self.user_type = 'admin'
        super().save(*args, **kwargs)

        
class Profile(models.Model):
    """Extended user profile model"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    activation_token = models.CharField(max_length=100, null=True, blank=True)
    token_generated_at = models.DateTimeField(null=True, blank=True)

    def generate_activation_token(self):
        token = uuid.uuid4().hex  # Generate a unique token
        self.activation_token = token
        self.save()
        return token   

    def __str__(self):
        return f"Profile for {self.user.username}"




