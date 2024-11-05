from rest_framework import serializers
from charge.models import Recharge
from cards.models import CardToCard

class RechargeSerializer(serializers.ModelSerializer):
    transaction_type = serializers.CharField(default='recharge')

    class Meta:
        model = Recharge
        fields = ['transaction_type', 'amount', 'timestamp', 'status' , 'id' , 'card_number' , 'mobile_number']

class CardToCardSerializer(serializers.ModelSerializer):
    transaction_type = serializers.CharField(default='card_to_card')

    class Meta:
        model = CardToCard
        fields = ['transaction_type', 'amount', 'created_at', 'status' ,  'desCardOwner' , 'initialCard' , 'id']
