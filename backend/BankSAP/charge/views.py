from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .models import Recharge
from .serializers import RechargeSerializer
from rest_framework.permissions import IsAuthenticated
import random
import pyotp
import base64
import secrets

class RechargeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        amount = request.data.get('amount')
        print("Received mobile_number:", mobile_number)
        print("Received amount:", amount)

        if not (mobile_number and len(mobile_number) == 11):
            return Response({"detail": "شماره موبایل باید 11 رقم باشد."}, status=status.HTTP_400_BAD_REQUEST)

        if not (amount and len(amount) <= 16):
            return Response({"detail": "این مبلغ برای خرید شارژ پذیرفته نیست."}, status=status.HTTP_400_BAD_REQUEST)
        
        

        recharge_data = {'mobile_number': mobile_number, 'amount': amount}
        cache.set(f'recharge_{request.user.id}', recharge_data, timeout=240)

        return Response({"detail": "اطلاعات شارژ با موفقیت ذخیره شد."}, status=status.HTTP_200_OK)
    

class SendOTPAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        recharge_data = cache.get(f'recharge_{request.user.id}')
        if not recharge_data:
            return Response({"detail": "اطلاعات شارژ یافت نشد. ابتدا اطلاعات شارژ را ثبت کنید."}, status=status.HTTP_400_BAD_REQUEST)
        totp = pyotp.TOTP('base32secret3232', digits=5)
        otp_code = totp.now()

        cache.set(f'otp_{request.user.id}', otp_code, timeout=120)
        phone_number = request.user.phone_number
        print(f"send code to this number {phone_number} is : {otp_code}")
        return Response({"detail": "کد OTP ارسال شد."}, status=status.HTTP_200_OK)


class VerifyCardAndOTPAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        card_number = request.data.get('initialCard')
        cvv2 = request.data.get('cvv2')
        cardMonth = request.data.get('cardMonth')
        cardYear = request.data.get('cardYear')
        dynamicPassword = request.data.get('dynamicPassword')


        cached_otp = cache.get(f'otp_{request.user.id}')
        if not cached_otp or cached_otp != dynamicPassword:
            #return Response({"detail": "رمز پویا نا متعبر است"}, status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        recharge_data = cache.get(f'recharge_{request.user.id}')
        if not recharge_data:
            return Response({"detail": "اطلاعات شارژ یافت نشد. لطفا اطلاعات را دوباره وارد کنید."}, status=status.HTTP_400_BAD_REQUEST)
        
        recharge = Recharge(
            user=request.user,
            mobile_number=recharge_data['mobile_number'],
            amount=recharge_data['amount']
        )
        recharge.save()
        cache.delete(f'recharge_{request.user.id}')
        cache.delete(f'otp_{request.user.id}')


        return Response({"detail": "خرید شارژ با موفقیت انجام شد."}, status=status.HTTP_200_OK)
