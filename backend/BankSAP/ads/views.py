from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Advertisement
from .serializers import AdvertisementSerializer
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated



class ActiveAdvertisementsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        ads = Advertisement.objects.filter(
            is_active=True,
            start_date__lte=today,
            end_date__gte=today
        )
        serializer = AdvertisementSerializer(ads, many=True)
        return Response(serializer.data)
