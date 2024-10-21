from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CardSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import Card
from decimal import Decimal
from django.core.cache import cache
from .models import CardToCard
from datetime import timedelta
from django.utils import timezone
import pyotp
import base64
import secrets
import jdatetime
from .models import SavedCard

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



class CardToCardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        initialCard = request.data.get('initialCard')
        desCard = request.data.get('desCard')
        amount = request.data.get('amount')
        cvv2 = request.data.get('cvv2')
        cardMonth = request.data.get('cardMonth')
        cardYear = request.data.get('cardYear')

        if initialCard== desCard:
            return Response(
                {"detail": "کارت مبدا و مقصد شما نمی‌تواند یکی باشد."},
                status=status.HTTP_400_BAD_REQUEST
            )        
        card_info = {
            'initialCard': initialCard,
            'desCard': desCard,
            'amount': amount,
            'cvv2': cvv2,
            'cardMonth': cardMonth,
            'cardYear': cardYear,
        }

        cache.set(f'card_info_{request.user.id}', card_info, timeout=600)

        return Response( status=status.HTTP_200_OK)




class GenerateOTPAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        card_info = cache.get(f'card_info_{request.user.id}')

        if not card_info:
            return Response(
                {"detail": "اطلاعات کارت به کارت پیدا نشد. لطفاً دوباره تلاش کنید."},
                status=status.HTTP_400_BAD_REQUEST
            )

        secret = secrets.token_bytes(10)  
        base32_secret = base64.b32encode(secret).decode('utf-8')  

        cache.set(f'secret_{request.user.id}', base32_secret)

        totp = pyotp.TOTP(base32_secret)
        otp = totp.now()
        otp_five_digit = str(int(otp) % 100000) 
        if len(otp_five_digit) < 5:  
            otp_five_digit = otp_five_digit.zfill(5)  

        otp_expiry = timezone.now() + timedelta(minutes=2)

        cache.set(f'otp_{request.user.id}', {'otp': otp_five_digit, 'expiry': otp_expiry}, timeout=120)

        phone_number = request.user.phone_number
        print(f"send code to this number {phone_number} is : {otp_five_digit}")

        return Response(
            {"detail": "رمز پویا در ترمینال نمایش داده شد."},
            status=status.HTTP_200_OK
        )



class VerifyOTPAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        otp_input = request.data.get('otp') 
        card_info = cache.get(f'card_info_{request.user.id}')
        secret = cache.get(f'secret_{request.user.id}')
        otp_data = cache.get(f'otp_{request.user.id}')

        transaction_date = jdatetime.datetime.now().strftime('%H:%M %Y/%m/%d')


        if not otp_data:
            return Response(
                {"detail": "رمز پویای شما یافت نشده است" , "transaction_date": transaction_date},
                status=status.HTTP_400_BAD_REQUEST
            )

        if timezone.now() > otp_data['expiry']:
            return Response(
                {"detail": "رمز پویای شما منقضی شده است." , "transaction_date": transaction_date },
                status=status.HTTP_400_BAD_REQUEST
            )

        if otp_input != otp_data['otp']:
            print(f"Failed OTP: {otp_input}, Expected OTP: {otp_data['otp']}")
            return Response(
                {"detail": "رمز پویا نادرست است." , "transaction_date": transaction_date },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not card_info:
            return Response(
                {"detail": "اطلاعات انتقال وجه یافت نشد." , "transaction_date": transaction_date},
                status=status.HTTP_400_BAD_REQUEST
            )

        card_transaction = CardToCard(
            user=request.user,
            initialCard=card_info['initialCard'],
            desCard=card_info['desCard'],
            amount=card_info['amount'],
            cvv2=card_info['cvv2'],
            cardMonth=card_info['cardMonth'],
            cardYear=card_info['cardYear'],
        )
        card_transaction.save()

        cache.delete(f'otp_{request.user.id}')
        cache.delete(f'card_info_{request.user.id}')
        cache.delete(f'secret_{request.user.id}')

        return Response(
            {
                "detail": "تراکنش با موفقیت انجام شد.",
                "transaction_date": card_transaction.created_at
            },
            status=status.HTTP_200_OK
        )
    

class SaveCardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        des_card = request.data.get('des_card')

        if SavedCard.objects.filter(user=request.user, des_card=des_card).exists():
            return Response({"detail": "این کارت قبلاً ذخیره شده است."}, status=status.HTTP_400_BAD_REQUEST)

        SavedCard.objects.create(user=request.user, des_card=des_card)
        return Response({"detail": "کارت با موفقیت ذخیره شد."}, status=status.HTTP_201_CREATED)