import jdatetime
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from charge.models import Recharge
from cards.models import CardToCard
from .serializers import RechargeSerializer, CardToCardSerializer
from datetime import datetime
import pytz
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework import status
from django.shortcuts import get_object_or_404

class TransactionHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        recharges = Recharge.objects.filter(user=user)
        card_to_cards = CardToCard.objects.filter(user=user)

        combined_with_dates = []
        iran_timezone = pytz.timezone("Asia/Tehran")

        # پردازش تراکنش‌های Recharge و تبدیل تاریخ به datetime شمسی
        for instance in recharges:
            timestamp = instance.timestamp
            if isinstance(timestamp, str):
                timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            iran_time = timestamp.astimezone(iran_timezone)
            jalali_datetime = jdatetime.datetime.fromgregorian(datetime=iran_time)
            combined_with_dates.append((instance, jalali_datetime))

        # پردازش تراکنش‌های CardToCard بدون تغییر فرمت (چون به صورت شمسی ذخیره شده‌اند)
        for instance in card_to_cards:
            created_at = instance.created_at
            created_at_datetime = jdatetime.datetime.strptime(created_at, '%H:%M %Y/%m/%d')
            combined_with_dates.append((instance, created_at_datetime))

        # مرتب‌سازی نزولی بر اساس datetime شمسی
        combined_with_dates.sort(key=lambda x: x[1], reverse=True)

        sorted_combined = [x[0] for x in combined_with_dates]
        return sorted_combined

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = []
        iran_timezone = pytz.timezone("Asia/Tehran")

        for instance in queryset:
            if isinstance(instance, Recharge):
                serialized = RechargeSerializer(instance).data
                timestamp = serialized.get('timestamp')
                if timestamp:
                    if isinstance(timestamp, str):
                        timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    iran_time = timestamp.astimezone(iran_timezone)
                    jalali_datetime = jdatetime.datetime.fromgregorian(datetime=iran_time)
                    serialized['timestamp'] = jalali_datetime.strftime('%H:%M %Y/%m/%d ')
                data.append(serialized)
            elif isinstance(instance, CardToCard):
                serialized = CardToCardSerializer(instance).data
                data.append(serialized)

        return Response(data)


class CardToCardHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CardToCardSerializer

    def get_queryset(self):
        user = self.request.user
        card_to_cards = CardToCard.objects.filter(user=user)

        combined_with_dates = []
        for instance in card_to_cards:
            created_at = instance.created_at
            created_at_datetime = jdatetime.datetime.strptime(created_at, '%H:%M %Y/%m/%d')
            combined_with_dates.append((instance, created_at_datetime))

        # مرتب‌سازی نزولی بر اساس datetime شمسی
        combined_with_dates.sort(key=lambda x: x[1], reverse=True)
        sorted_combined = [x[0] for x in combined_with_dates]
        return sorted_combined


class RechargeHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RechargeSerializer

    def get_queryset(self):
        user = self.request.user
        recharges = Recharge.objects.filter(user=user)

        combined_with_dates = []
        iran_timezone = pytz.timezone("Asia/Tehran")

        for instance in recharges:
            timestamp = instance.timestamp
            if isinstance(timestamp, str):
                timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            iran_time = timestamp.astimezone(iran_timezone)
            jalali_datetime = jdatetime.datetime.fromgregorian(datetime=iran_time)
            combined_with_dates.append((instance, jalali_datetime))

        # مرتب‌سازی نزولی بر اساس datetime شمسی
        combined_with_dates.sort(key=lambda x: x[1], reverse=True)

        # فقط نمونه‌ها را به صورت مرتب‌شده برمی‌گرداند
        sorted_combined = [x[0] for x in combined_with_dates]
        return sorted_combined

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = []
        iran_timezone = pytz.timezone("Asia/Tehran")

        for instance in queryset:
            serialized = RechargeSerializer(instance).data
            timestamp = instance.timestamp
            if timestamp:
                if isinstance(timestamp, str):
                    timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                iran_time = timestamp.astimezone(iran_timezone)
                # تبدیل به فرمت شمسی
                jalali_datetime = jdatetime.datetime.fromgregorian(datetime=iran_time)
                serialized['timestamp'] = jalali_datetime.strftime('%H:%M %Y/%m/%d ')
            data.append(serialized)

        return Response(data)
    

class TransactionDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, transaction_id):
        user = request.user

        # تلاش برای یافتن تراکنش Recharge
        try:
            transaction = Recharge.objects.get(id=transaction_id, user=user)
            transaction.delete()
            return Response({'status': 'Transaction deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Recharge.DoesNotExist:
            pass  # اگر پیدا نشد، ادامه می‌دهد.

        # تلاش برای یافتن تراکنش CardToCard
        try:
            transaction = CardToCard.objects.get(id=transaction_id, user=user)
            transaction.delete()
            return Response({'status': 'Transaction deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except CardToCard.DoesNotExist:
            return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)