from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .models import Recharge
from .serializers import RechargeSerializer
from rest_framework.permissions import IsAuthenticated

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
        cache.set(f'recharge_{request.user.id}', recharge_data, timeout=600)

        return Response({"detail": "اطلاعات شارژ با موفقیت ذخیره شد."}, status=status.HTTP_200_OK)