from django.urls import path
from .views import RegisterCardView, CardListView , DeleteCardView ,EditCardView ,CardToCardAPIView , GenerateOTPAPIView , VerifyOTPAPIView

urlpatterns = [
    path('add-card/', RegisterCardView.as_view(), name='register-card'),
    path('my-cards/', CardListView.as_view(), name='my-cards'),
    path('delete-card/<str:card_number>/', DeleteCardView.as_view(), name='delete-card'),
    path('info-card/<str:card_number>/', EditCardView.as_view(), name='edit-card-get'),
    path('edit-card/<int:id>/', EditCardView.as_view(), name='edit-card-put'),
    path('card-to-card/', CardToCardAPIView.as_view(), name='card-to-card'),
    path('send-otp/', GenerateOTPAPIView.as_view(), name='generate-otp'),
    path('verify-otp/', VerifyOTPAPIView.as_view(), name='verify-otp-card'),

]
