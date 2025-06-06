from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Count, Q
from .models import Doctor, Appointment, Prescription
from .serializers import DoctorSerializers, AppointmentSerializers, PrescriptionSerializers
from patientapp.models import Patient, PatientDischargeDetails
from patientapp.serializers import PatientSerializer
from .permissions import IsDoctor
from rest_framework.pagination import PageNumberPagination

class PatientPagination(PageNumberPagination):
    page_size = 5  # Show 5 patients per page
    page_size_query_param = 'page_size'
    max_page_size = 50


class DoctorViewsets(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializers
    # Will uncomment after creating authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated,IsDoctor]

    '''
    ✅ Default Endpoints (Generated by DRF because of viewset):

    GET /doctor/profile/ → List all doctors

    POST /doctor/profile/ → Create a new doctor

    GET /doctor/profile/{id}/ → Retrieve a specific doctor

    PUT /doctor/profile/{id}/ → Update a doctor's details

    DELETE /doctor/profile/{id}/ → Delete a doctor
    '''


    #Retrieve the profile of the logged-in doctor.
    @action(detail=False, methods=['get'])
    def my_profile(self, request):#/api/doctor/profile/my_profile/
        """Get the logged-in doctor's profile"""
        doctor = get_object_or_404(Doctor, user=request.user)
        serializer = self.get_serializer(doctor,context={'request': request})
        return Response(serializer.data)

    #new
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):#api/doctor/profile/dashboard_stats/
        """Optimized Doctor Statistics API"""
        doctor = getattr(request.user, 'doctor', None)
        if not doctor:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)

        stats = {
            #Uses related_name (less queries)
            'assigned_patients': doctor.assigned_patients.count(),  
            'appointments': doctor.appointments.count(),
            'discharged_patients': doctor.discharged_patients.count()
        }
        return Response(stats)



    #Get a list of all patients assigned to the logged in doctor.
    @action(detail=False, methods=['get'])
    def my_patients(self, request):#api/doctor/profile/my_patients/
        """Get all patients assigned to the logged in doctor"""
        doctor = get_object_or_404(Doctor, user=request.user)
        # patients = Patient.objects.filter(assigned_doctor=doctor)
        patients = Patient.objects.filter(assigned_doctor=doctor).select_related('user')
        #     # Get patients directly assigned to doctor
        # assigned_patients = Patient.objects.filter(assigned_doctor=doctor)
            # Get patients who have appointments with the doctor
        # appointment_patients = Patient.objects.filter(
        #     appointments__doctor=doctor
        # ).distinct()
            # Combine both querysets
        # patients = assigned_patients.union(appointment_patients).select_related('user')
        # Handle search by name or symptoms
        search_term = request.query_params.get('search', '')
        if search_term:
            patients = patients.filter(
                Q(user__first_name__icontains=search_term) | 
                Q(user__last_name__icontains=search_term) |
                Q(symptoms__icontains=search_term)
            )
            
        serializer = PatientSerializer(patients, many=True)
                # Apply custom pagination
        paginator = PatientPagination()
        paginated_patients = paginator.paginate_queryset(patients, request)
        if paginated_patients is not None:  # Check if pagination is applied
            serializer = PatientSerializer(paginated_patients, many=True)
            return paginator.get_paginated_response(serializer.data)

        # Fallback in case pagination is not applied (unlikely)
        # serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
    
    #Get all patients discharged by the logged in doctor.
    @action(detail=False, methods=['get'])
    def discharged_patients(self, request):#/api/doctor/profile/discharged_patients/
        """Get all discharged patients by the logged in doctor"""
        doctor = get_object_or_404(Doctor, user=request.user)
        discharged = PatientDischargeDetails.objects.filter(doctor=doctor)
        
        # Custom serializer would be better here
        return Response(discharged.values())


class AppointmentViewsets(viewsets.ModelViewSet):#/api/doctor/appointments/
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializers
    #Will uncomment after creating authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    '''
    ✅ Default Endpoints (Generated by DRF):

    GET /doctor/appointments/ → List all appointments

    POST /doctor/appointments/ → Create a new appointment

    GET /doctor/appointments/{id}/ → Retrieve a specific appointment

    PUT /doctor/appointments/{id}/ → Update appointment details

    DELETE /doctor/appointments/{id}/ → Delete an appointment
    '''
    def get_queryset(self):
        """Filter appointments by logged-in user role"""
        user = self.request.user #this is the logged in user, it can be doctor or patient
        
        #for doctor
        if hasattr(user, 'doctor'):
            return Appointment.objects.filter(doctor=user.doctor)# Doctors see their own appointments
        
        #for patient(now patients can access their appointments through the doctor app’s endpoint.)
        elif hasattr(user, 'patient'):
            return Appointment.objects.filter(patient=user.patient)# Patients see their own appointments
        
        # if the user is not doctor not patient
        return Appointment.objects.none()
    
    @action(detail=False, methods=['get'])
    def doctor_appointments(self, request):#/api/doctor/appointments/doctor_appointments/
        """Get appointments for logged-in doctor"""
        doctor = get_object_or_404(Doctor, user=request.user)
        appointments = Appointment.objects.filter(doctor=doctor)
        serializer = self.get_serializer(appointments, many=True)# a doctor can have many appointments
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'patient'):
            serializer.save(patient=user.patient)
        else:
            raise PermissionDenied("Only patients can create appointments.")
        
    def destroy(self, request, *args, **kwargs):
        appointment = self.get_object()
        user = request.user

        if hasattr(user, 'doctor') and appointment.doctor.user == user:
            return super().destroy(request, *args, **kwargs)
        elif hasattr(user, 'patient') and appointment.patient.user == user:
            return super().destroy(request, *args, **kwargs)
        else:
            raise PermissionDenied("You can't cancel this appointment.")


class PrescriptionViewsets(viewsets.ModelViewSet):#	/api/doctor/prescriptions/
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializers
    #Will uncomment after creating authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    '''
     Default Endpoints (Generated by DRF):

    GET /doctor/prescriptions/ → List all prescriptions

    POST /doctor/prescriptions/ → Create a new prescription

    GET /doctor/prescriptions/{id}/ → Retrieve a specific prescription

    PUT /doctor/prescriptions/{id}/ → Update prescription details

    DELETE /doctor/prescriptions/{id}/ → Delete a prescription
    '''


    def get_queryset(self):
        """Filter prescriptions by logged-in user role"""
        user = self.request.user
        
        # For doctors
        if hasattr(user, 'doctor'):
            return Prescription.objects.filter(doctor=user.doctor)
        elif hasattr(user, 'patient'):
            return Prescription.objects.filter(patient=user.patient)           
        return Prescription.objects.none()
    
    @action(detail=True, methods=['post'])
    def create_from_appointment(self, request, pk=None):#Creates a prescription for a specific appointment (pk is the appointment's ID).

    #url:/api/doctor/prescriptions/{id}/create_from_appointment/

        """Create a prescription based on an appointment"""
        doctor = get_object_or_404(Doctor, user=request.user)#Ensures only a doctor can create a prescription.
        appointment = get_object_or_404(Appointment, pk=pk, doctor=doctor)
        #Fetches the Appointment object with the given pk and ensures it belongs to the logged-in doctor. If not found, returns a 404 error.

        patient = appointment.patient  # ✅ You need this line to use `patient` later
        
        # Create prescription
        data = request.data.copy() #Copies the request data to avoid modifying the original data.
        data['doctor'] = doctor.id #Adds the logged-in doctor’s ID to the prescription data.
        data['patient'] = appointment.patient.id #Adds the patient’s ID from the appointment to the prescription data.
        data['appointment'] = appointment.id #Adds the appointment’s ID to the prescription data.
        
        serializer = self.get_serializer(data=data)#Initializes the serializer with the modified data.
        serializer.is_valid(raise_exception=True)#Validates the data. If invalid, raises an exception with a 400 error.
        serializer.save()#Saves the validated data as a new Prescription object.
        
        # Mark appointment as completed and saves it
        appointment.is_completed = True
        if not patient.assigned_doctor:
            patient.assigned_doctor = doctor  # from appointment.doctor
            patient.save()
        appointment.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)#Sends the newly created prescription as a response with a 201 status code















