from rest_framework import serializers

from commonapp.serializers import UserSerializer
from .models import Patient,PatientDischargeDetails,Invoice
class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Nest user details in profile
    #By nesting user = UserSerializer(read_only=True), the patient API will now return full user info instead of just user id.
    profile_pic = serializers.ImageField(required=False)#Without required=False, DRF will expect profile_pic on every update.
    profile_pic_url = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    department_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = '__all__'
    #added newly for profile picture
    def get_profile_pic_url(self, obj):
        if obj.profile_pic:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_pic.url)
        return None
    
    def get_doctor_name(self, obj):
        return obj.doctor_name
        
    def get_department_name(self, obj):
        return obj.department_name
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        profile_pic = validated_data.pop('profile_pic', None)

        # Update user fields
        user = instance.user
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.save()

        # Update patient fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if profile_pic:
            instance.profile_pic = profile_pic

        instance.save()
        return instance

    

class PatientDischargeDetailsSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    class Meta:
        model = PatientDischargeDetails
        fields = '__all__'

    def get_doctor_name(self, obj):
        if obj.doctor and obj.doctor.user:
            return f"{obj.doctor.user.first_name} {obj.doctor.user.last_name}"
        return None
    
class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields= '__all__'

