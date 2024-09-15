from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from .models import User
from .serializers import UserSerializer
import random
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated

class RegisterView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        national_code = request.data.get('national_code')
        username = request.data.get('username')

        if User.objects.filter(phone_number=phone_number).exists():
            return Response({"detail": "Phone number already registered."}, status=status.HTTP_400_BAD_REQUEST)

        otp = random.randint(1000, 9999) 
        
        print(f"Generated OTP for {phone_number}: {otp}")

        cache.set(phone_number, otp, timeout=300)  
        cache.set(f'user_data_{phone_number}', request.data, timeout=300)  
        return Response({"detail": f"Your OTP code is {otp}"}, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    def post(self, request):
        otp = request.data.get('otp') 
        phone_number = request.data.get('phone_number')  

        print(f"Received OTP: {otp}, Phone Number: {phone_number}")

        cached_otp = cache.get(phone_number)
        user_data = cache.get(f'user_data_{phone_number}')

        print(f"Cached OTP: {cached_otp}, User Data: {user_data}")

        if cached_otp and int(otp) == cached_otp:
            if user_data:
                serializer = UserSerializer(data=user_data)
                if serializer.is_valid():
                    user = serializer.save()
                    refresh = RefreshToken.for_user(user)
                    cache.delete(phone_number)         
                    cache.delete(f'user_data_{phone_number}')  
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }, status=status.HTTP_201_CREATED)
                
                
                print(f"Serializer Errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
            return Response({"detail": "User data not found in cache."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Invalid OTP or OTP expired."}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        national_code = request.data.get('national_code')

        try:
            user = User.objects.get(phone_number=phone_number, national_code=national_code)
        except User.DoesNotExist:
            return Response({"detail": "شماره موبایل یا کد ملی اشتباه است."}, status=status.HTTP_400_BAD_REQUEST)

       
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        print(f"Validation Errors: {serializer.errors}")  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
