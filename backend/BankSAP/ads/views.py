from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Advertisement
from .serializers import AdvertisementSerializer
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils.timezone import now
import pytz
class ActiveAdvertisementsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        ads = Advertisement.objects.filter(is_active=True)
        serializer = AdvertisementSerializer(ads, many=True)
        return Response(serializer.data)



class CreateAdvertisementView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()  
        iran_timezone = pytz.timezone('Asia/Tehran')
        iran_time = now().astimezone(iran_timezone)

        formatted_time = iran_time.strftime('%H:%M') 
        data['start_time'] = formatted_time
        data['end_time'] = formatted_time

        serializer = AdvertisementSerializer(data=data)
        
        if serializer.is_valid():
            advertisement = serializer.save()  
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)