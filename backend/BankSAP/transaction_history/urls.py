from django.urls import path
from .views import TransactionHistoryView

urlpatterns = [
    path('transaction/', TransactionHistoryView.as_view(), name='transaction-history'),
]
