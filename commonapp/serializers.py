from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from doctorapp.models import Doctor
from patientapp.models import Patient
from .models import CustomUser, Profile

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User registration"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    image = serializers.ImageField(required=False, allow_null=True)
    user_type = serializers.ChoiceField(choices=CustomUser.USER_TYPE_CHOICES, required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name', 'image', 'user_type')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }

    def validate(self, attrs):# attrs = dictionary of all validated fields
        """Validate password match and unique constraints"""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        if CustomUser.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "A user with this username already exists."})

        attrs.pop('password2')
        return attrs

    def validate_user_type(self, value):# value = specific field (user_type)
        """Ensure user_type is in lowercase before validation"""
        value = value.lower()  # Convert to lowercase to ensure validation success
        valid_choices = dict(CustomUser.USER_TYPE_CHOICES).keys()  # Get valid keys

        if value not in valid_choices:
            raise serializers.ValidationError(f"'{value}' is not a valid choice. Choose from {list(valid_choices)}")
        
        return value

    def create(self, validated_data):# validated_data = final data after validation
        """Create user and associated profile"""
        image = validated_data.pop('image', None)
        
        # Create user
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_active=False,  # Set to inactive until email confirmation
            user_type=validated_data['user_type']
        )

        # # Create profile
        profile, created = Profile.objects.get_or_create(user=user)
        if created:
            print(f"Profile created for {user.username}")
        else:
            print(f"Profile already exists for {user.username}")       

        # Add image if provided
        if image:
            profile.image = image
            profile.save()

        # # Create profile(if i use this ,it'll create error)
        # #new
        # profile = Profile.objects.create(user=user)
        # if image:
        #     profile.image = image
        #     profile.save()

        # Create corresponding doctor/patient profile
        if user.user_type == 'doctor':
            doctor = Doctor.objects.create(user=user)
            if image:  # Also copy to doctor profile
                doctor.profile_pic = image
                doctor.save()
        elif user.user_type == 'patient':
            patient = Patient.objects.create(user=user)
            if image:  # Also copy to patient profile
                patient.profile_pic = image
                patient.save()

        return user

 