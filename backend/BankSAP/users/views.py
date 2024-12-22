from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from .models import User
from .serializers import UserSerializer
from datetime import datetime, timedelta
from django.utils import timezone
import secrets
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .validators import CustomPasswordValidator  
import re

def is_valid_national_code(national_code):
    if len(national_code) != 10 or not national_code.isdigit():
        return False

    check = int(national_code[9])
    s = sum([int(national_code[x]) * (10 - x) for x in range(9)]) % 11
    if s < 2:
        return check == s
    return check == 11 - s




def is_valid_phone_number(phone_number):
    valid_prefixes = {
        '0911', '0912', '0913', '0914', '0915', '0916', '0917', '0918', '0919', '0910',
        '0990', '0991', '0992', '0993', '0935', '0936', '0937', '0939', '0901',
        '0902', '0903', '0904', '0905', '0921', '0920', '0922', '0923'
    }
    if not re.match(r'^09\d{9}$', phone_number):
        return False
    prefix = phone_number[:4]
    return prefix in valid_prefixes




def mock_shahkar_service(national_code, phone_number):
    if not is_valid_national_code(national_code):
        return {
            'status': 'error',
            'message': 'کد ملی نامعتبر است'
        }
    if not is_valid_phone_number(phone_number):
        return {
            'status': 'error',
            'message': 'شماره موبایل نامعتبر است'
        }
    return {
        'status': 'success',
        'message': 'اطلاعات معتبر است'
    }




class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        national_code = request.data.get('national_code')
        phone_number = request.data.get('phone_number')
        errors = {}
        if User.objects.filter(national_code=national_code).exists() and User.objects.filter(phone_number=phone_number).exists():
            errors['nationalId'] = ["این کد ملی قبلاً ثبت شده است."]
            errors['mobile'] = ["این شماره تلفن قبلاً ثبت شده است."]
        elif User.objects.filter(phone_number=phone_number).exists():
            errors['mobile'] = ["این شماره تلفن قبلاً ثبت شده است."]
        elif User.objects.filter(national_code=national_code).exists():
            errors['nationalId'] = ["این کد ملی قبلاً ثبت شده است."]

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        shahkar_response = mock_shahkar_service(national_code, phone_number)
        if shahkar_response['status'] == 'error':
            if "کد ملی" in shahkar_response['message']:
                return Response({'nationalId': shahkar_response['message']}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'mobile': shahkar_response['message']}, status=status.HTTP_400_BAD_REQUEST)

        otp = secrets.randbelow(90000) + 10000
        print(f"Generated OTP for {phone_number}: {otp}")

        cache.set(phone_number, otp, timeout=300)  
        cache.set(f'user_data_{phone_number}', request.data, timeout=120)  

        user_data = {
            'phone_number': phone_number,
            'national_code': national_code,
        }

        serializer = UserSerializer(data=user_data)
        if not serializer.is_valid():
            print(f"Serializer Errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": f"Your OTP code is {otp}"}, status=status.HTTP_200_OK)



class VerifyOTPView(APIView):
    def post(self, request):
        otp = request.data.get('otp')
        phone_number = request.data.get('phone_number')

        print(f"Received OTP: {otp}, Phone Number: {phone_number}")

        cached_otp = cache.get(phone_number)
        user_data = cache.get(f'user_data_{phone_number}')

        print(f"Cached OTP: {cached_otp}, User Data: {user_data}")  
        if cached_otp is None:
            return Response({"detail": "کد شما منقضی شد، لطفا دوباره تلاش کنید."}, status=status.HTTP_400_BAD_REQUEST)

        if cached_otp and int(otp) == cached_otp:
            if user_data:
                serializer = UserSerializer(data=user_data)
                if serializer.is_valid():
                    user = serializer.save()
                    user.last_login = timezone.now()
                    user.save(update_fields=['last_login'])
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


class UserProfileCompleteView(APIView):
    permission_classes = [IsAuthenticated]  

    def put(self, request):
        user = request.user
        password = request.data.get('password')
        username = request.data.get('username')
        validator = CustomPasswordValidator()
        errors = {}
        if username and User.objects.filter(username=username).exclude(id=user.id).exists():
            errors['username'] = "نام کاربری با این اسم قبلاً ثبت شده است."
        try:
            validator.validate(password)
        except ValidationError as e:
            errors['password'] = e.messages  
        
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserSerializer(user, data=request.data, partial=True) 

        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
      def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username:
            return Response({"detail": "نام کاربری وارد نشده است."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "نام کاربری اشتباه است."}, status=status.HTTP_400_BAD_REQUEST)
        except User.MultipleObjectsReturned:
            return Response({"detail": "چندین کاربر با این نام کاربری وجود دارد."}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_superuser:
            return Response({"detail": "این نام کاربری برای سوپر یوزر است. لطفاً از API مربوط به سوپر یوزر استفاده کنید."}, status=status.HTTP_403_FORBIDDEN)

        if not user.check_password(password):
            return Response({"detail": "رمز عبور اشتباه است."}, status=status.HTTP_400_BAD_REQUEST)

        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff,
        }, status=status.HTTP_200_OK)

class LoginSuperUSer(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username:
            return Response({"detail": "نام کاربری وارد نشده است."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "نام کاربری اشتباه است."}, status=status.HTTP_400_BAD_REQUEST)
        except User.MultipleObjectsReturned:
            return Response({"detail": "چندین کاربر با این نام کاربری وجود دارد."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_superuser:
            return Response({"detail": "این API فقط برای سوپر یوزرها است."}, status=status.HTTP_403_FORBIDDEN)

        if not user.check_password(password):
            return Response({"detail": "رمز عبور اشتباه است."}, status=status.HTTP_400_BAD_REQUEST)

        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff,
        }, status=status.HTTP_200_OK)
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        new_username = request.data.get("username")
        new_mobile = request.data.get("phone_number")
        new_email = request.data.get("email")
        serializer = UserSerializer(user, data=request.data, partial=True)
        if new_username and User.objects.filter(username=new_username).exclude(id=user.id).exists():
            return Response(
                {"error": "نام کاربری تکراری است."},
                status=status.HTTP_400_BAD_REQUEST,
                headers={"error": "error"}
            )
        if new_mobile and User.objects.filter(phone_number=new_mobile).exclude(id=user.id).exists():
            return Response(
                {"error": "شماره موبایل تکراری است."},
                status=status.HTTP_400_BAD_REQUEST,
                headers={"error": "error"}
            )
            
        if new_email and User.objects.filter(email=new_email).exclude(id=user.id).exists():
            return Response(
                {"error": "ایمیل تکراری است."},
                status=status.HTTP_400_BAD_REQUEST,
                headers={"error": "error"}
            )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        print(f"Validation Errors: {serializer.errors}")  
        response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        response['error'] = 'error'
        return response


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request):
        print(request.data) 
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response({"detail": "لطفاً هر دو فیلد رمز عبور فعلی و رمز عبور جدید را وارد کنید."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(current_password):
            print("Current password is incorrect.")
            return Response({"detail": "رمز عبور فعلی خود را اشتباه وارد کردید."}, status=status.HTTP_400_BAD_REQUEST)
        
        if current_password == new_password:
            return Response({"detail": "رمز عبور جدید نمی‌تواند با رمز عبور فعلی یکسان باشد."}, status=status.HTTP_400_BAD_REQUEST)
        
        validator = CustomPasswordValidator()
        try:
            validator.validate(new_password) 
        except ValidationError as e:
            return Response({"detail":e.messages}, status=status.HTTP_400_BAD_REQUEST)
        

        user.set_password(new_password)
        user.save()

        return Response({"detail": "رمز عبور با موفقیت تغییر کرد."}, status=status.HTTP_200_OK)
    

class UserCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_count = User.objects.exclude(is_superuser=True).count()
        return Response(user_count, status=status.HTTP_200_OK)


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        limit = request.query_params.get('limit')
        gender = request.query_params.get('gender')
        last_login = request.query_params.get('last_login')

        users = User.objects.all()
        users = User.objects.filter(is_superuser=False)

        if last_login:
            now = timezone.now()
            if last_login == "today":
                users = users.filter(last_login__date=now.date())
            elif last_login == "last_7_days":
                start_date = now - timedelta(days=7)
                users = users.filter(last_login__date__gte=start_date.date())
            elif last_login == "this_month":
                start_date = now.replace(day=1)
                users = users.filter(last_login__date__gte=start_date.date())
            elif last_login == "this2_month":
                current_month_start = now.replace(day=1)
                last_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
                users = users.filter(last_login__date__gte=last_month_start.date(), last_login__date__lt=current_month_start.date())

        if gender:
            users = users.filter(gender=gender)

        if limit and limit.isdigit():
            users = users[:int(limit)]

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated] 
    authentication_classes = [JWTAuthentication]

    def delete(self, request, user_id):

        if not request.user.is_superuser:
            return Response({"detail": "شما مجوز حذف کاربران را ندارید."}, status=status.HTTP_403_FORBIDDEN)

        try:

            user = User.objects.get(id=user_id)
            
        except User.DoesNotExist:
            return Response({"detail": "کاربر مورد نظر یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response({"detail": "کاربر با موفقیت حذف شد."}, status=status.HTTP_200_OK)



class AdminChangePasswordView(APIView):
    permission_classes = [IsAuthenticated] 
    authentication_classes = [JWTAuthentication]

    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "کاربر یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response({"detail": "لطفاً هر دو فیلد رمز عبور فعلی و رمز عبور جدید را وارد کنید."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(current_password):
            return Response({"detail": "رمز عبور فعلی اشتباه است."}, status=status.HTTP_400_BAD_REQUEST)


        if current_password == new_password:
            return Response({"detail": "رمز عبور جدید نمی‌تواند با رمز عبور فعلی یکسان باشد."}, status=status.HTTP_400_BAD_REQUEST)

        validator = CustomPasswordValidator()
        try:
            validator.validate(new_password)
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"detail": "رمز عبور با موفقیت تغییر کرد."}, status=status.HTTP_200_OK)


class RegisterPublicKeyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        public_key = request.data.get('public_key')

        if not public_key:
            return Response({"error": "کلید عمومی ارسال نشده است."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.public_key = public_key
        user.save()

        return Response({"message": "کلید عمومی با موفقیت ثبت شد."}, status=status.HTTP_200_OK)