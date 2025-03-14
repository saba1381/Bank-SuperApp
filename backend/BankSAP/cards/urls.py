from django.urls import path
from .views import RegisterCardView, CardListView , DeleteCardView ,EditCardView ,CardToCardAPIView , GenerateOTPAPIView , VerifyOTPAPIView , SaveCardAPIView, DeleteCardAPIView , AllCardToCardTransactionsView

urlpatterns = [
    path('add-card/', RegisterCardView.as_view(), name='register-card'),
    path('my-cards/', CardListView.as_view(), name='my-cards'),
    path('delete-card/<str:card_number>/', DeleteCardView.as_view(), name='delete-card'),
    path('info-card/<str:card_number>/', EditCardView.as_view(), name='edit-card-get'),
    path('edit-card/<int:id>/', EditCardView.as_view(), name='edit-card-put'),
    path('card-to-card/', CardToCardAPIView.as_view(), name='card-to-card'),
    path('send-otp/', GenerateOTPAPIView.as_view(), name='generate-otp'),
    path('verify-otp/', VerifyOTPAPIView.as_view(), name='verify-otp-card'),
    path('save_desCard/', SaveCardAPIView.as_view(), name='save_desCard'),
    path('delete-des-card/<str:des_card>/', DeleteCardAPIView.as_view(), name='delete-des-card'),
    path('all-transfers/', AllCardToCardTransactionsView.as_view(), name='all-transfers'),
]
