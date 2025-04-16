
from django.db import models
from patientapp.models import Patient

class EmergencyCase(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='emergency_cases')
    severity = models.CharField(max_length=50, choices=[('Critical', 'Critical'), ('Moderate', 'Moderate'), ('Mild', 'Mild')])
    description = models.TextField()
    admission_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)  # Track if emergency is still active

    def __str__(self):
        return f"Emergency Case of {self.patient.user.first_name} - {self.severity}"

class Bed(models.Model):
    bed_number = models.CharField(max_length=20, unique=True)
    is_occupied = models.BooleanField(default=False)
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_beds')
    assigned_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    ward = models.CharField(max_length=50, choices=[
        ('General', 'General Ward'),
        ('ICU', 'Intensive Care Unit'),
        ('Emergency', 'Emergency Ward'),
        ('Pediatric', 'Pediatric Ward'),
        ('Maternity', 'Maternity Ward')
    ], default='General')

    def __str__(self):
        return f"Bed {self.bed_number} - {self.ward} - {'Occupied' if self.is_occupied else 'Available'}"