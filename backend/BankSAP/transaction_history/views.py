import jdatetime
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from charge.models import Recharge
from cards.models import CardToCard
from .serializers import RechargeSerializer, CardToCardSerializer
from datetime import datetime

class TransactionHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        recharges = Recharge.objects.filter(user=user)
        card_to_cards = CardToCard.objects.filter(user=user)


        for card in card_to_cards:
            try:
                card_date = jdatetime.datetime.strptime(card.created_at, '%H:%M %Y/%m/%d')
                card.created_at_dt = card_date.togregorian()
                if card.created_at_dt.tzinfo is not None:
                    card.created_at_dt = card.created_at_dt.replace(tzinfo=None)  # تبدیل به offset-naive
            except ValueError:
                card.created_at_dt = datetime(1970, 1, 1, 0, 0)

        combined = sorted(
            list(recharges) + list(card_to_cards),
            key=lambda instance: (instance.timestamp.replace(tzinfo=None) if isinstance(instance, Recharge) else instance.created_at_dt),
            reverse=True
        )
        return combined

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        recharge_queryset = [item for item in queryset if isinstance(item, Recharge)]
        card_queryset = [item for item in queryset if isinstance(item, CardToCard)]

        recharge_serializer = RechargeSerializer(recharge_queryset, many=True)
        card_serializer = CardToCardSerializer(card_queryset, many=True)

        data = recharge_serializer.data + card_serializer.data
        return Response(data)
