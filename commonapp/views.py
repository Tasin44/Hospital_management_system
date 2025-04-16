from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail
from django.conf import settings
# from django.utils import timezone
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.contrib.auth.models import User
from .models import CustomUser, Profile
from .serializers import UserSerializer
from doctorapp.models import Doctor
from patientapp.models import Patient
from django.contrib.auth import logout as auth_logout

def get_tokens_for_user(user):
    """Generate JWT tokens for a user"""
    refresh = RefreshToken.for_user(user)
    # Add custom claims#this 2 lines newly added
    refresh['user_type'] = user.user_type
    refresh['username'] = user.username
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class SignupView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    @transaction.atomic
    def post(self, request):
        serializer = UserSerializer(data=request.data)#Initializes the UserSerializer with the incoming request data for validation.

        if serializer.is_valid():
            try:
                user = serializer.save()
                
               
                '''  
                # Create corresponding profile based on user type
                #actually I don't need it, because in my serializers, I've" if user.user_type == 'doctor':"
                 the same user gets a Doctor created twice, triggering a duplicate key error (since Doctor.user is a OneToOneField).
                
                # if user.user_type == 'doctor':
                #     Doctor.objects.create(user=user)
                # elif user.user_type == 'patient':
                #     Patient.objects.create(user=user)
                '''
                
                # Generate and save activation token
                profile = Profile.objects.get(user=user)
                activation_token = profile.generate_activation_token()
                
                # Create activation link
                # activation_link = f"{settings.FRONTEND_URL}/api/activate/{activation_token}"
                activation_link = f"http://localhost:8000/api/activate/{activation_token}/"

                # Send activation email
                send_mail(
                    'Activate Your Account',
                    f'Click this link to activate your account: {activation_link}',
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )

                return Response(
                    {
                        "message": "Signup successful! Please check your email to activate your account.",
                        "user_type": user.user_type
                    },
                    status=status.HTTP_201_CREATED
                )

            except Exception as e:
                transaction.set_rollback(True)
                # Log the actual error for better debugging
                print(f"Error occurred: {str(e)}")  # or use logging
                return Response(
                    {'error': f'Signup failed: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class ActivateAccountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, activation_token):
        # Find profile with matching token
        profile = get_object_or_404(Profile, activation_token=activation_token)
        user = profile.user

        # Check token age (optional: can set expiration)
        if user.is_active:
            return Response(
                {"message": "Account is already activated."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Activate user
        user.is_active = True
        user.save()
        print(f"User created: {user.username}")

        # Clear activation token
        profile.activation_token = None
        profile.save()

        return Response(
            {"message": "Account activated successfully."},
            status=status.HTTP_200_OK
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {"error": "Username and password are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use CustomUser model for authentication
        user = CustomUser.objects.filter(username=username).first()

        if not user:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Check password
        if not user.check_password(password):
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.is_active:
            return Response(
                {'error': 'Account inactive. Please confirm your email.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Generate JWT tokens
        tokens = get_tokens_for_user(user)

        # Get profile image URL
        image_url = None
        try:
            if hasattr(user, 'profile') and user.profile.image:
                image_url = request.build_absolute_uri(user.profile.image.url)
        except Exception:
            pass

        return Response({
            'message': 'Login successful!',
            'username': user.username,
            'email': user.email,
            'image': image_url,
            'user_type': user.user_type,
            'access': tokens['access'],
            'refresh': tokens['refresh'],
        }, status=status.HTTP_200_OK)
    

class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]#its mandatory
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")  # Get the refresh token from request body
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=400)

            token = RefreshToken(refresh_token)  # Create a RefreshToken instance
            token.blacklist()  # Blacklist the refresh token (requires SimpleJWT blacklist app)

            return Response({"message": "Logged out successfully"}, status=200)

        except Exception as e:
            return Response({"error": "Logout failed", "details": str(e)}, status=400)



