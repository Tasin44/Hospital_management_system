# hospitalapp/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from datetime import datetime

from .models import EmergencyCase, Bed
from .serializers import EmergencyCaseSerializer, BedSerializer
from doctorapp.permissions import IsDoctor
from patientapp.permissions import IsPatient

class EmergencyCaseViewset(viewsets.ModelViewSet):
    queryset = EmergencyCase.objects.all()
    serializer_class = EmergencyCaseSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Mark an emergency case as resolved"""
        if not request.user.is_doctor:
            return Response(
                {"error": "Only doctors can resolve emergency cases"},
                status=status.HTTP_403_FORBIDDEN
            )

        emergency_case = self.get_object()
        emergency_case.is_active = False
        emergency_case.save()

        return Response(
            {"message": "Emergency case resolved successfully"},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def active_cases(self, request):
        """Get all active emergency cases"""
        active_cases = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_cases, many=True)
        return Response(serializer.data)

class BedViewset(viewsets.ModelViewSet):
    queryset = Bed.objects.all()
    serializer_class = BedSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter beds based on user role and query parameters"""
        queryset = Bed.objects.all()
        
        # Filter by ward if specified
        ward = self.request.query_params.get('ward', None)
        if ward:
            queryset = queryset.filter(ward=ward)
            
        # Filter by availability if specified
        available = self.request.query_params.get('available', None)
        if available is not None:
            is_available = available.lower() == 'true'
            queryset = queryset.filter(is_occupied=not is_available)
            
        return queryset

    @action(detail=True, methods=['post'])
    def assign_patient(self, request, pk=None):
        """Assign a patient to a bed"""
        # if not request.user.is_doctor:
        if not (request.user.is_doctor or request.user.is_superuser):
            return Response(
                {"error": "Only doctors and Admin can assign beds"},
                status=status.HTTP_403_FORBIDDEN
            )

        bed = self.get_object()
        patient_id = request.data.get('patient_id')

        if not patient_id:
            return Response(
                {"error": "Patient ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if bed.is_occupied:
            return Response(
                {"error": "Bed is already occupied"},
                status=status.HTTP_400_BAD_REQUEST
            )

        from patientapp.models import Patient
        patient = get_object_or_404(Patient, id=patient_id)
        
        bed.patient = patient
        bed.is_occupied = True
        bed.assigned_date = datetime.now()
        bed.save()

        return Response(
            {"message": f"Patient assigned to bed {bed.bed_number} successfully"},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def release_bed(self, request, pk=None):
        """Release a patient from a bed"""
        if not request.user.is_doctor:
            return Response(
                {"error": "Only doctors can release beds"},
                status=status.HTTP_403_FORBIDDEN
            )

        bed = self.get_object()
        if not bed.is_occupied:
            return Response(
                {"error": "Bed is not occupied"},
                status=status.HTTP_400_BAD_REQUEST
            )

        bed.patient = None
        bed.is_occupied = False
        bed.assigned_date = None
        bed.save()

        return Response(
            {"message": f"Bed {bed.bed_number} released successfully"},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def available_beds(self, request):
        """Get all available beds"""
        available_beds = self.get_queryset().filter(is_occupied=False)
        serializer = self.get_serializer(available_beds, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def ward_summary(self, request):
        """Get summary of bed availability by ward"""
        summary = {}
        for ward_choice in dict(Bed.ward.field.choices).keys():
            ward_beds = Bed.objects.filter(ward=ward_choice)
            summary[ward_choice] = {
                'total': ward_beds.count(),
                'occupied': ward_beds.filter(is_occupied=True).count(),
                'available': ward_beds.filter(is_occupied=False).count()
            }
        return Response(summary)
