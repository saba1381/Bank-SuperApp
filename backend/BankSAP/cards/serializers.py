from rest_framework import serializers
from .models import Card , SavedCard

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'card_number', 'full_name', 'expiration_month', 'expiration_year' , 'bank_name']

