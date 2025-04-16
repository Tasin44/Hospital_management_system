
from django.db import models
# from django.contrib.auth.models import User
from commonapp.models import CustomUser  # Use your custom user model
import uuid  # For UUID primary key (if needed)


class Patient(models.Model):  
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to='profile_pics/PatientProfilePic/', null=True, blank=True)  
    address = models.TextField()  
    mobile = models.CharField(max_length=20, null=False)  
    symptoms = models.TextField(null=False)  


    assigned_doctor = models.ForeignKey('doctorapp.Doctor', on_delete=models.SET_NULL, null=True, blank=True,related_name='assigned_patients')  # one to many(A patient can be assigned to one doctor, but a doctor can have multiple patients.)The related_name is plural,which clearly indicates that the doctor has multiple assigned patients.
    
    admit_date = models.DateField(auto_now_add=True)  
    status = models.BooleanField(default=True)  # Default True to indicate active patients
    #new
    blood_group = models.CharField(max_length=5, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    # def __str__(self):
    #     return f"{self.user.username} - {self.status}"
      # Add properties for easier access
    @property
    def doctor_name(self):
        if self.assigned_doctor:
            return f"{self.assigned_doctor.user.first_name} {self.assigned_doctor.user.last_name}"
        return "Not Assigned"
    
    @property
    def department_name(self):
        if self.assigned_doctor:
            return self.assigned_doctor.department
        return "N/A"



#no need duplicate Appointment model

class PatientDischargeDetails(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE,related_name='discharge_details')  # Changed from IntegerField to ForeignKey
    # Changed: Add doctor relationship
    doctor = models.ForeignKey('doctorapp.Doctor', on_delete=models.SET_NULL, null=True, related_name='discharged_patients')#patients who have been discharged under the care of a specific doctor.
    
    #patient_name = models.CharField(max_length=40)
    #assigned_doctor_name = models.CharField(max_length=40)
    address = models.TextField()
    mobile = models.CharField(max_length=20, null=True)
    symptoms = models.TextField(null=True)  
    admit_date = models.DateField(auto_now_add=True)  
    release_date = models.DateField(null=False)  
    days_spent = models.PositiveIntegerField(null=False)  
    
    # Charges (Used snake_case for best)
    room_charge = models.PositiveIntegerField(null=False)
    medicine_cost = models.PositiveIntegerField(null=False)
    doctor_fee = models.PositiveIntegerField(null=False)
    other_charge = models.PositiveIntegerField(null=False)
    total = models.PositiveIntegerField(null=False)

    def __str__(self):
        return f"Discharge Details for {self.patient_name}"

    @property
    def patient_name(self):
        """Returns the patient's full name"""
        return self.patient.user.get_full_name() if self.patient else "Unknown"
    
    @property
    def assigned_doctor_name(self):
        """Returns the assigned doctor's full name"""
        return self.doctor.user.get_full_name() if self.doctor else "Not Assigned"




# Added: New model for invoices and billing
class Invoice(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='invoices')
    invoice_date = models.DateField(auto_now_add=True)
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    paid_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        status = "Paid" if self.is_paid else "Outstanding"
        return f"Invoice {self.id} for {self.patient.user.username} - {status}"

