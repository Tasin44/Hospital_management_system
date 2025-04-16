from django.db import models
# from django.contrib.auth.models import User
from commonapp.models import CustomUser  # Use your custom user model

departments=[
('Cardiologist','Cardiologist'),
('Dermatologists','Dermatologists'),
('Emergency Medicine Specialists','Emergency Medicine Specialists'),
('Allergists/Immunologists','Allergists/Immunologists'),
('Anesthesiologists','Anesthesiologists'),
('Colon and Rectal Surgeons','Colon and Rectal Surgeons')
]

class Doctor(models.Model):
    user=models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    # profile_pic= models.ImageField(upload_to='profile_pics/DoctorProfilePic/',null=True,blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    address = models.CharField(max_length=40)
    mobile = models.CharField(max_length=20,null=True)
    department= models.CharField(max_length=50,choices=departments,default='Cardiologist')
    status=models.BooleanField(default=False)
 
    @property
    def get_id(self):
        return self.user.id
    
    def __str__(self):
        return "{} ({})".format(self.user.first_name,self.department)
    

class Appointment(models.Model):
    patient = models.ForeignKey('patientapp.Patient', on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateTimeField()
    reason = models.TextField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f" {self.appointment_date}"
    
class Prescription(models.Model):
    patient = models.ForeignKey('patientapp.Patient', on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    symptoms = models.TextField()
    medication = models.TextField()
    dosage = models.CharField(max_length=100)
    instructions = models.TextField(blank=True, null=True)
    date_issued = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription for  {self.doctor.user.first_name}"
    

