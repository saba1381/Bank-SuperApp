from django.urls import path
from .views import RechargeAPIView , SendOTPAPIView , VerifyCardAndOTPAPIView

urlpatterns = [
    path('recharge/', RechargeAPIView.as_view(), name='recharge_mobile'),
    path('send-otp/', SendOTPAPIView.as_view(), name='send-otp'),
    path('verify-info/', VerifyCardAndOTPAPIView.as_view(), name='verify-info'),
]
