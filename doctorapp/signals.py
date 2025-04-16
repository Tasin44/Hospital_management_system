from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Doctor

@receiver(post_save, sender=Doctor)
def activate_doctor(sender, instance, created, **kwargs):
    if created and not instance.status:  # If doctor is newly created and inactive
        instance.status = True
        instance.save()
