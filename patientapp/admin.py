from django.contrib import admin
from .models import Patient, PatientDischargeDetails,Invoice

# Register the Patient model
admin.site.register(Patient)
admin.site.register(PatientDischargeDetails)
admin.site.register(Invoice)