from rest_framework import serializers
from .models import Recharge

class RechargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recharge
        fields = ['mobile_number', 'amount' , 'card_number' , 'status', 'timestamp' , 'user']
