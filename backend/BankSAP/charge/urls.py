from django.urls import path
from .views import RechargeAPIView

urlpatterns = [
    path('recharge/', RechargeAPIView.as_view(), name='recharge_mobile'),
]
