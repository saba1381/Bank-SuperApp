from rest_framework import serializers
from .models import Card

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['card_number', 'full_name', 'expiration_month', 'expiration_year']
