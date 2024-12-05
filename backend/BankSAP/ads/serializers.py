from rest_framework import serializers
from .models import Advertisement

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = ['id', 'title', 'description', 'link', 'start_date', 'end_date', 'is_active' ,'end_time' , 'start_time']

    def get_start_time(self, obj):
        return obj.start_time.strftime('%H:%M') if obj.start_time else None

    def get_end_time(self, obj):
        return obj.end_time.strftime('%H:%M') if obj.end_time else None

