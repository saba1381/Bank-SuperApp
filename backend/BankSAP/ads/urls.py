from django.urls import path
from .views import ActiveAdvertisementsView , CreateAdvertisementView

urlpatterns = [
    path('active/', ActiveAdvertisementsView.as_view(), name='active-ads'),
    path('create/', CreateAdvertisementView.as_view(), name='create-advertisement'),
]
