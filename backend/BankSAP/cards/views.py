from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CardSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import Card


class RegisterCardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        card_number = request.data.get('card_number')
        full_name = request.data.get('full_name')
        expiration_month = request.data.get('expiration_month')
        expiration_year = request.data.get('expiration_year')

        # پیدا کردن کارت با شماره کارت وارد شده
        card = Card.objects.filter(card_number=card_number).first()

        if card:
            # اگر کارت توسط همان کاربر ثبت شده بود
            if card.user == request.user:
                return Response(
                    {"detail": "این کارت قبلاً توسط شما ثبت شده است"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                # اگر کارت توسط کاربر دیگری ثبت شده بود، اما اطلاعات نادرست بود
                if card.full_name != full_name or card.expiration_month != expiration_month or card.expiration_year != expiration_year:
                    return Response(
                        {"detail": "اطلاعات کارت اشتباه است"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                else:
                    # اگر کارت توسط کاربر دیگری ثبت شده و اطلاعات درست است
                    return Response(
                        {"detail": "این کارت قبلاً توسط کاربر دیگری ثبت شده است"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
        # اگر کارت قبلاً ثبت نشده بود، آن را ثبت کن
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