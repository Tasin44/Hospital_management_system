# hospitalapp/serializers.py
from rest_framework import serializers
from .models import EmergencyCase, Bed

class EmergencyCaseSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    
    class Meta:
        model = EmergencyCase
        fields = '__all__'
    
    def get_patient_name(self, obj):
        return f"{obj.patient.user.first_name} {obj.patient.user.last_name}" if obj.patient.user else "Unknown"

class BedSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Bed
        fields = '__all__'
    
    def get_patient_name(self, obj):
        if obj.patient and obj.patient.user:
            return f"{obj.patient.user.first_name} {obj.patient.user.last_name}"
        return "Unassigned"