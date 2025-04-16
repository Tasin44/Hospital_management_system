from django.apps import AppConfig


class DoctorappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'doctorapp'
    
    def ready(self):
        import doctorapp.signals  # Import signals when the app is ready