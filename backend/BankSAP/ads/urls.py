from django.urls import path
from .views import ActiveAdvertisementsView

urlpatterns = [
    path('active/', ActiveAdvertisementsView.as_view(), name='active-ads'),
]
