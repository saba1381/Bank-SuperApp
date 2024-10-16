from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CardSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import Card
from decimal import Decimal


class RegisterCardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        card_number = request.data.get('card_number')
        full_name = request.data.get('full_name')
        expiration_month = request.data.get('expiration_month')
        expiration_year = request.data.get('expiration_year')
        bank_name = request.data.get('bank_name')

        card = Card.objects.filter(card_number=card_number).first()

        if card:
            if card.user == request.user:
                return Response(
                    {"detail": "این کارت قبلاً توسط شما ثبت شده است"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                
                if card.full_name != full_name or card.expiration_month != expiration_month or card.expiration_year != expiration_year:
                    return Response(
                        {"detail": "اطلاعات کارت اشتباه است"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                else:
                    
                    return Response(
                        {"detail": "این کارت قبلاً توسط کاربر دیگری ثبت شده است"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
    
        serializer = CardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CardListView(generics.ListAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)  
    


class DeleteCardView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, card_number):
        try:
            card = Card.objects.get(card_number=card_number, user=request.user)
            card.delete()
            return Response({"detail": "کارت با موفقیت حذف شد"}, status=status.HTTP_204_NO_CONTENT)
        except Card.DoesNotExist:
            return Response({"detail": "کارت یافت نشد"}, status=status.HTTP_404_NOT_FOUND)
        

class EditCardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, card_number):
        try:
            card = Card.objects.get(card_number=card_number, user=request.user)
        except Card.DoesNotExist:
            return Response({"detail": "کارت یافت نشد"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CardSerializer(card)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        try:
            card = Card.objects.get(id=id, user=request.user)
        except Card.DoesNotExist:
            return Response({"detail": "کارت یافت نشد"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CardSerializer(card, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Card
from rest_framework.permissions import IsAuthenticated

class CardToCardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        source_card_number = request.data.get('source_card_number')
        destination_card_number = request.data.get('destination_card_number')
        amount = request.data.get('amount')
        cvv2 = request.data.get('cvv2')
        expiration_month = request.data.get('expiration_month')
        expiration_year = request.data.get('expiration_year')

        # بررسی کارت مبدأ
        try:
            source_card = Card.objects.get(card_number=source_card_number, user=request.user)
        except Card.DoesNotExist:
            return Response({"detail": "کارت مبدأ معتبر نیست"}, status=status.HTTP_400_BAD_REQUEST)

        # بررسی CVV2 و تاریخ انقضا کارت مبدأ
        if source_card.cvv2 != cvv2 or source_card.expiration_month != expiration_month or source_card.expiration_year != expiration_year:
            return Response({"detail": "اطلاعات کارت مبدأ اشتباه است"}, status=status.HTTP_400_BAD_REQUEST)

        # بررسی کارت مقصد
        try:
            destination_card = Card.objects.get(card_number=destination_card_number)
        except Card.DoesNotExist:
            return Response({"detail": "کارت مقصد معتبر نیست"}, status=status.HTTP_400_BAD_REQUEST)

        # بررسی موجودی کارت مبدأ
        if source_card.balance < Decimal(amount):
            return Response({"detail": "موجودی کارت مبدأ کافی نیست"}, status=status.HTTP_400_BAD_REQUEST)

        # اگر تمام شرایط درست بود، کاربر به مرحله درخواست رمز پویا هدایت شود
        return Response({"detail": "اطلاعات کارت صحیح است. درخواست رمز پویا ارسال شود."}, status=status.HTTP_200_OK)
