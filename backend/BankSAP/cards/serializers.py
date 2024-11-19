from rest_framework import serializers
from .models import Card , SavedCard , CardToCard

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'card_number', 'full_name', 'expiration_month', 'expiration_year' , 'bank_name']


class CardToCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardToCard
        fields = [
            'user', 'initialCard', 'desCard', 'desCardOwner',
            'amount', 'status', 'created_at'
        ]

