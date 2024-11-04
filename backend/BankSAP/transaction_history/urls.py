from django.urls import path
from .views import TransactionHistoryView , CardToCardHistoryView , RechargeHistoryView , TransactionDeleteView

urlpatterns = [
    path('transaction/', TransactionHistoryView.as_view(), name='transaction-history'),
    path('transaction/card-to-card/', CardToCardHistoryView.as_view(), name='card-to-card-history'),
    path('transaction/recharge/', RechargeHistoryView.as_view(), name='recharge-history'),
    path('transaction/delete/<int:transaction_id>/', TransactionDeleteView.as_view(), name='recharge-delete'),
]
