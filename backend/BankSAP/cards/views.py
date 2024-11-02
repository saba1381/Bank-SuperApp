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
        def get_card_owner(card_number):
            mock_owners = {
                '603799': 'علی رضا زاده', 
                '589210': 'مریم نوروزی',
                '621986': 'محمد حسینی',
                '502229' : 'صبا بصیری' ,
                '622106' :'مریم امینی' ,
                '589463' : 'محمد باقری',
                '610433' : 'نقی جوادی'
            }
            card_prefix = card_number[:6] 
            return mock_owners.get(card_prefix, 'نامشخص')  

        des_card_owner = get_card_owner(card_info['desCard'])

        cache.set(f'card_info_{request.user.id}', card_info, timeout=600)

        return Response({"desCard_owner": des_card_owner}, status=status.HTTP_200_OK)




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
        otp_data = cache.get(f'otp_{request.user.id}')
        transaction_date = jdatetime.datetime.now().strftime('%H:%M %Y/%m/%d')

        # ایجاد تراکنش با وضعیت پیش‌فرض ناموفق
        des_card_owner = self.get_card_owner(card_info['desCard']) if card_info else 'نامشخص'
        card_transaction = CardToCard(
            user=request.user,
            initialCard=card_info['initialCard'] if card_info else '',
            desCard=card_info['desCard'] if card_info else '',
            desCardOwner=des_card_owner,
            amount=card_info['amount'] if card_info else 0,
            cvv2=card_info['cvv2'] if card_info else '',
            cardMonth=card_info['cardMonth'] if card_info else '',
            cardYear=card_info['cardYear'] if card_info else '',
            status=False
        )
        card_transaction.save()

        # بررسی عدم وجود OTP
        if not otp_data:
            return Response(
                {"detail": "رمز پویای شما یافت نشده است", "transaction_date": transaction_date},
                status=status.HTTP_400_BAD_REQUEST
            )

        # بررسی انقضای OTP
        if timezone.now() > otp_data['expiry']:
            return Response(
                {"detail": "رمز پویای شما منقضی شده است.", "transaction_date": transaction_date},
                status=status.HTTP_400_BAD_REQUEST
            )

        # بررسی صحت OTP
        if otp_input != otp_data['otp']:
            return Response(
                {"detail": "رمز پویا نادرست است.", "transaction_date": transaction_date},
                status=status.HTTP_400_BAD_REQUEST
            )

        # بررسی اطلاعات کارت
        if not card_info:
            return Response(
                {"detail": "اطلاعات انتقال وجه یافت نشد.", "transaction_date": transaction_date},
                status=status.HTTP_400_BAD_REQUEST
            )

        # تعیین مالک کارت مقصد
        des_card_owner = self.get_card_owner(card_info['desCard'])

        # اگر تمام بررسی‌ها موفقیت‌آمیز بود، وضعیت تراکنش به موفقیت تغییر داده می‌شود
        card_transaction.status = True
        card_transaction.save()

        # حذف اطلاعات OTP و کارت از کش
        cache.delete(f'otp_{request.user.id}')
        cache.delete(f'card_info_{request.user.id}')

        return Response(
            {
                "detail": "تراکنش با موفقیت انجام شد.",
                "transaction_date": card_transaction.created_at,
                "desCard_owner": des_card_owner
            },
            status=status.HTTP_200_OK
        )

    def get_card_owner(self, card_number):
        mock_owners = {
            '603799': 'علی رضا زاده', 
            '589210': 'مریم نوروزی',
            '621986': 'محمد حسینی',
            '502229': 'صبا بصیری',
            '622106': 'مریم امینی',
            '589463': 'محمد باقری',
            '610433': 'نقی جوادی'
        }
        card_prefix = card_number[:6] 
        return mock_owners.get(card_prefix, 'نامشخص')

    

class SaveCardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        des_card = request.data.get('des_card')

        if SavedCard.objects.filter(user=request.user, des_card=des_card).exists():
            return Response({"detail": "این کارت قبلاً ذخیره شده است."}, status=status.HTTP_400_BAD_REQUEST)

        SavedCard.objects.create(user=request.user, des_card=des_card)
        return Response({"detail": "کارت با موفقیت ذخیره شد."}, status=status.HTTP_201_CREATED)
    
    def get(self, request):
        saved_cards = SavedCard.objects.filter(user=request.user)
        serialized_cards = [{"des_card": card.des_card} for card in saved_cards]
        return Response(serialized_cards, status=status.HTTP_200_OK)
    
class DeleteCardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, des_card):
        print(f"Request to delete card: {des_card} for user: {request.user.username}")
        try:
            saved_card = SavedCard.objects.get(user=request.user, des_card=des_card)
            print(f"Card found: {saved_card.des_card} - Deleting...")
            saved_card.delete()
            print("Card deleted successfully.")
            return Response({"detail": "کارت با موفقیت حذف شد."}, status=status.HTTP_200_OK)
        except SavedCard.DoesNotExist:
            print(f"Card not found for user: {request.user.username}")
            return Response({"detail": "کارت مورد نظر یافت نشد."}, status=status.HTTP_404_NOT_FOUND)