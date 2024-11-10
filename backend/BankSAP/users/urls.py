from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginView, UpdateProfileView ,ChangePasswordView , UserProfileCompleteView , UserCountView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/update/', UpdateProfileView.as_view(), name='update_profile'), 
    path('password/change/', ChangePasswordView.as_view(), name='change_password'),
    path('complete-info/', UserProfileCompleteView.as_view(), name='user-profile-complete'),
    path('number-of-users/', UserCountView.as_view(), name='count-users'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)