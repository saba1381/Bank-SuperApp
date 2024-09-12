from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginView, UpdateProfileView 

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/update/', UpdateProfileView.as_view(), name='update_profile'), 
    path('profile/get-info/', UpdateProfileView.as_view(), name='profile'), # اضافه کردن این خط
]
