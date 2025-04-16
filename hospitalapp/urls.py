from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BedViewset, EmergencyCaseViewset

router = DefaultRouter()
router.register('beds', BedViewset, basename='bed')
router.register('emergency-cases', EmergencyCaseViewset, basename='emergencycase')

urlpatterns = [
    path('', include(router.urls)),
]
