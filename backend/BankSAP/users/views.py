from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from .models import User
from .serializers import UserSerializer
import random

class RegisterView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        national_code = request.data.get('national_code')

        if User.objects.filter(phone_number=phone_number).exists():
            return Response({"detail": "Phone number already registered."}, status=status.HTTP_400_BAD_REQUEST)

        otp = random.randint(1000, 9999)
        cache.set(phone_number, otp, timeout=300)  # OTP معتبر برای 5 دقیقه

        # ارسال OTP به کاربر از طریق API (به عنوان مثال در پاسخ)
        return Response({"detail": f"Your OTP code is {otp}"}, status=status.HTTP_200_OK)

class VerifyOTPView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        otp = request.data.get('otp')

        if cache.get(phone_number) == int(otp):
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Invalid OTP or OTP expired."}, status=status.HTTP_400_BAD_REQUEST)
