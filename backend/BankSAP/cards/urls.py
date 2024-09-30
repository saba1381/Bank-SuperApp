from django.urls import path
from .views import RegisterCardView, CardListView , DeleteCardView ,EditCardView

urlpatterns = [
    path('add-card/', RegisterCardView.as_view(), name='register-card'),
    path('my-cards/', CardListView.as_view(), name='my-cards'),
    path('delete-card/<str:card_number>/', DeleteCardView.as_view(), name='delete-card'),
    path('edit-card/<str:card_number>/', EditCardView.as_view(), name='edit-card'),

]
