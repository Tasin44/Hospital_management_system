from rest_framework import serializers

from commonapp.serializers import UserSerializer
from .import models
from datetime import timedelta
from django.utils import timezone

class DoctorSerializers(serializers.ModelSerializer):
    # user = UserSerializer(read_only=True)
    user = UserSerializer()#If user is missing or depth=1 is not used, you'll get an empty or null user object when search doctor
    profile_pic = serializers.ImageField(required=False)#Without required=False, DRF will expect profile_pic on every update.
    profile_pic_url = serializers.SerializerMethodField()#it's necessary, i'm using it in frontend
    class Meta:
        model = models.Doctor
        fields = '__all__'
        
    def get_user(self, obj):
        return {
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'email': obj.user.email
        }
    #added newly for profile picture
    def get_profile_pic_url(self, obj):
        if obj.profile_pic:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_pic.url)
        return None
    
    def update(self, instance, validated_data):
        # Handle profile_pic update
        user_data = validated_data.pop('user', None)
        profile_pic = validated_data.pop('profile_pic', None)
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if profile_pic:
            instance.profile_pic = profile_pic
        instance.save()
        return instance
    #new

    
class AppointmentSerializers(serializers.ModelSerializer):
    class Meta:
        model = models.Appointment
        fields = '__all__'
        read_only_fields = ('is_completed',)
    
    def validate_appointment_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Appointment date must be in the future")
        return value

    def validate(self, data):
        # Check doctor availability
        if models.Appointment.objects.filter(
            doctor=data['doctor'],
            appointment_date__range=(
                data['appointment_date'] - timedelta(minutes=29),
                data['appointment_date'] + timedelta(minutes=29)
            )
        ).exists():
            raise serializers.ValidationError("Doctor is not available at this time")
        return data
    
class PrescriptionSerializers(serializers.ModelSerializer):
    class Meta:
        model = models.Prescription
        fields = '__all__'


