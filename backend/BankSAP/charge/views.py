from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .models import Recharge
from .serializers import RechargeSerializer
from rest_framework.permissions import IsAuthenticated
import pyotp
import jdatetime
import pytz
from datetime import datetime, timedelta
from rest_framework import generics

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
        recharge_data = cache.get(f'recharge_{request.user.id}')
        iran_timezone = pytz.timezone("Asia/Tehran")
        iran_time = datetime.now().astimezone(iran_timezone)
        jalali_date = jdatetime.datetime.fromgregorian(datetime=iran_time).strftime('%Y/%m/%d %H:%M:%S')

        recharge = Recharge(
            user=request.user,
            mobile_number=recharge_data['mobile_number'] if recharge_data else '',
            amount=recharge_data['amount'] if recharge_data else 0,
            status=False,
            card_number =card_number
        )
        recharge.save()
        

        if not recharge_data:
            return Response({"detail": "اطلاعات شارژ یافت نشد. لطفا اطلاعات را دوباره وارد کنید." , "charge_date": jalali_date}, status=status.HTTP_400_BAD_REQUEST)
        


        cached_otp = cache.get(f'otp_{request.user.id}')
        if not cached_otp or cached_otp != dynamicPassword:
            #return Response({"detail": "رمز پویا نا متعبر است"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"charge_date": jalali_date},status=status.HTTP_400_BAD_REQUEST)
        
        

        recharge.status = True
        recharge.save()
        iran_time = recharge.timestamp.astimezone(iran_timezone)
        jalali_date = jdatetime.datetime.fromgregorian(datetime=iran_time).strftime('%Y/%m/%d %H:%M:%S')
        
        cache.delete(f'recharge_{request.user.id}')
        cache.delete(f'otp_{request.user.id}')


        return Response({"detail": "خرید شارژ با موفقیت انجام شد." , "charge_date": jalali_date}, status=status.HTTP_200_OK)


from rest_framework.response import Response
import jdatetime
import pytz
from datetime import datetime, timedelta

class AllRechargeTransactionsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RechargeSerializer

    def get_queryset(self):
        queryset = Recharge.objects.all().order_by('-timestamp')

        date_filter = self.request.query_params.get('date_filter')
        if date_filter:
            now = datetime.now()
            if date_filter == 'today':
                start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
                end_date = now.replace(hour=23, minute=59, second=59, microsecond=999999)
                queryset = queryset.filter(timestamp__gte=start_date, timestamp__lte=end_date)
            elif date_filter == 'thisweek':
                start_date = now - timedelta(days=7)
                queryset = queryset.filter(timestamp__gte=start_date)
            elif date_filter == 'thisMonth':
                start_date = now - timedelta(days=30)
                queryset = queryset.filter(timestamp__gte=start_date)
            elif date_filter == 'lastTwoMonth':
                start_date = now - timedelta(days=60)
                queryset = queryset.filter(timestamp__gte=start_date)

        limit = self.request.query_params.get('limit')
        if limit:
            try:
                limit = int(limit)
                queryset = queryset[:limit]
            except ValueError:
                pass  

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = self.serializer_class(queryset, many=True).data

        iran_timezone = pytz.timezone("Asia/Tehran")
        for item in serialized_data:
            timestamp = item.get('timestamp')
            if timestamp:
                if isinstance(timestamp, str):
                    timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                iran_time = timestamp.astimezone(iran_timezone)
                jalali_datetime = jdatetime.datetime.fromgregorian(datetime=iran_time)
                item['timestamp'] = jalali_datetime.strftime('%H:%M %Y/%m/%d')

        return Response(serialized_data)
