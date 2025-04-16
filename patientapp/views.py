

from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated#Builtin
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
from .models import Patient, PatientDischargeDetails, Invoice
from .serializers import InvoiceSerializer, PatientSerializer, PatientDischargeDetailsSerializer
from doctorapp.models import Doctor, Appointment, Prescription
from doctorapp.serializers import DoctorSerializers
from .permissions import IsPatient
from hospitalapp.models import Bed, EmergencyCase  
from hospitalapp.serializers import BedSerializer, EmergencyCaseSerializer
# REST API ViewSets
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from io import BytesIO
from django.utils.encoding import smart_str
class PatientViewSet(viewsets.ModelViewSet):
    """API for managing Patients"""
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    # Will uncomment after creating authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated,IsPatient]
    parser_classes = [MultiPartParser, FormParser]  # for image/file handling

    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        patient = get_object_or_404(Patient, user=request.user)

        # fallback logic from discharge, if those details were not provided,it'll catch from discharge
        updated = False  # Track if any field was updated

        if not patient.symptoms or not patient.assigned_doctor or not patient.mobile or not patient.address:
            last_discharge = PatientDischargeDetails.objects.filter(patient=patient).last()
            if last_discharge:
                if not patient.symptoms and last_discharge.symptoms:
                    patient.symptoms = last_discharge.symptoms
                    updated = True
                if not patient.assigned_doctor and last_discharge.doctor:
                    patient.assigned_doctor = last_discharge.doctor
                    updated = True
                if not patient.mobile and last_discharge.mobile:
                    patient.mobile = last_discharge.mobile
                    updated = True
                if not patient.address and last_discharge.address:
                    patient.address = last_discharge.address
                    updated = True

        # Saving to patientapp_patient table(Patient model) only if any changes were made
        if updated:
            patient.save()

        serializer = self.get_serializer(patient, context={'request': request})
        # Get current occupied bed
        bed = Bed.objects.filter(patient=patient, is_occupied=True).first()
        bed_data = BedSerializer(bed).data if bed else None

        # Get current active emergency case
        emergency = EmergencyCase.objects.filter(patient=patient, is_active=True).first()
        emergency_data = EmergencyCaseSerializer(emergency).data if emergency else None

        return Response({
            'profile': serializer.data,
            'bed': bed_data,
            'emergency_case': emergency_data
        })

    @action(detail=False, methods=['put'], url_path='update_profile')
    def update_profile(self, request):
        patient = get_object_or_404(Patient, user=request.user)
        serializer = self.get_serializer(patient, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully', 'data': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def dashboard_overview(self, request):
        """Get dashboard information for patient"""
        patient = get_object_or_404(Patient, user=request.user)
        
        appointments_count = Appointment.objects.filter(patient=patient).count()
        prescriptions_count = Prescription.objects.filter(patient=patient).count()
        
        # Try to get doctor from patient first
        doctor = patient.assigned_doctor
        
        # If no doctor assigned but discharged, pull from discharge
        if not doctor:
            latest_discharge = PatientDischargeDetails.objects.filter(patient=patient).last()
            if latest_discharge:
                doctor = latest_discharge.doctor
        
        # Safely get doctor name and department
        doctor_name = "Not Assigned"
        department = "N/A"
        
        if doctor:
            # Handle doctor being either an object or string
            if hasattr(doctor, 'user') and doctor.user:
                doctor_name = f"{doctor.user.first_name} {doctor.user.last_name}"
                
            # Handle department with safer attribute checking
            if hasattr(doctor, 'department'):
                if hasattr(doctor.department, 'name'):
                    department = doctor.department.name
                elif isinstance(doctor.department, str):
                    department = doctor.department
        
        data = {
            'patient_name': f"{patient.user.first_name} {patient.user.last_name}" if patient.user else "Unknown",
            'doctor_name': doctor_name,
            'department': department,
            'admit_date': patient.admit_date,
            'appointments_count': appointments_count,
            'prescriptions_count': prescriptions_count,
            'is_discharged': PatientDischargeDetails.objects.filter(patient=patient).exists()
        }
        
        return Response(data)

    @action(detail=False, methods=['get'], url_path='search_doctors')
    def search_doctors(self, request):
        queryset = Doctor.objects.all()
        # Skip filters for testing
        search = request.query_params.get('search')
        department = request.query_params.get('department')
        
        if search:
            queryset = queryset.filter(user__first_name__icontains=search)
        if department:
            queryset = queryset.filter(department__icontains=department)

        serializer = DoctorSerializers(queryset, many=True)
        return Response(serializer.data)



class PatientDischargeDetailsViewSet(viewsets.ModelViewSet):
    """API for managing Patient Discharge Details"""
    # queryset = PatientDischargeDetails.objects.all()
    queryset = PatientDischargeDetails.objects.select_related('patient__user', 'doctor__user')
    serializer_class = PatientDischargeDetailsSerializer
    #Will uncomment after creating authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Allow patients to view only their discharge details"""
        user = self.request.user
        if hasattr(user, 'patient'):
            return PatientDischargeDetails.objects.filter(patient=user.patient)
        return PatientDischargeDetails.objects.none()
    

#===========
class InvoiceViewSet(viewsets.ModelViewSet):
    """API for managing patient invoices"""
    #Will uncomment after creating authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    serializer_class = InvoiceSerializer
    
    def get_queryset(self):
        """Allow patients to view only their invoices"""
        user = self.request.user
        if hasattr(user, 'patient'):#Checks if the logged-in user is a patient (i.e., has a related Patient object).
            return Invoice.objects.filter(patient=user.patient)#If the user is a patient, it returns only their invoices.
        return Invoice.objects.none()#If the user is not a patient, it returns an empty queryset (Invoice.objects.none()).
    
    #Retrieves all unpaid invoices for the logged-in patient.
    @action(detail=False, methods=['get'])
    def outstanding(self, request):#API Endpoint: /api/invoices/outstanding/
        """Get all outstanding invoices"""
        patient = get_object_or_404(Patient, user=request.user)
        invoices = Invoice.objects.filter(patient=patient, is_paid=False)#Fetches invoices for the specific patient where is_paid=False (unpaid invoices).
        return Response(InvoiceSerializer(invoices, many=True).data) #list response
    
    # Retrieves all paid invoices for the logged-in patient.
    @action(detail=False, methods=['get'])
    def paid(self, request):#API Endpoint: /api/invoices/paid/
        """Get all paid invoices"""
        patient = get_object_or_404(Patient, user=request.user)
        invoices = Invoice.objects.filter(patient=patient, is_paid=True)#Fetches invoices for the specific user where is_paid=True (already paid invoices).
        return Response(InvoiceSerializer(invoices, many=True).data)
    
    
    @action(detail=True, methods=['get'], url_path='download')
    def download_invoice(self, request, pk=None):
        invoice = get_object_or_404(Invoice, pk=pk, patient__user=request.user)

        try:
            buffer = BytesIO()
            p = canvas.Canvas(buffer)
            patient_name = invoice.patient.user.get_full_name() or invoice.patient.user.username

            p.setFont("Helvetica", 14)
            p.drawString(100, 800, f"Invoice ID: {invoice.id}")
            p.drawString(100, 780, f"Patient: {smart_str(patient_name)}")
            p.drawString(100, 760, f"Date: {invoice.invoice_date.strftime('%Y-%m-%d')}")
            p.drawString(100, 740, f"Description: {invoice.description or 'N/A'}")
            p.drawString(100, 720, f"Amount: ${invoice.amount}")
            p.drawString(100, 700, f"Status: {'Paid' if invoice.is_paid else 'Unpaid'}")

            p.showPage()
            p.save()

            pdf_content = buffer.getvalue()  # Read content before closing buffer
            buffer.close()  # Now safe to close

            response = HttpResponse(pdf_content, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.id}.pdf"'
            response['Content-Length'] = len(pdf_content)

            return response

        except Exception as e:
            return Response({'error': f'PDF generation failed: {str(e)}'}, status=500)
