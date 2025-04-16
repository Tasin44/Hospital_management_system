# patientapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, PatientDischargeDetailsViewSet, InvoiceViewSet

router = DefaultRouter()
router.register(r'profile', PatientViewSet, basename='patient')
router.register(r'discharge', PatientDischargeDetailsViewSet, basename='discharge')
router.register(r'invoices', InvoiceViewSet, basename='invoice')

urlpatterns = [
    path('', include(router.urls)),
]



