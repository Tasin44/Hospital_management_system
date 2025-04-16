from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewsets, AppointmentViewsets, PrescriptionViewsets

router = DefaultRouter()
router.register(r'profile', DoctorViewsets, basename='doctor')
router.register(r'appointments', AppointmentViewsets, basename='doctor-appointment')
router.register(r'prescriptions', PrescriptionViewsets, basename='prescription')

urlpatterns = [
    path('', include(router.urls)),
]