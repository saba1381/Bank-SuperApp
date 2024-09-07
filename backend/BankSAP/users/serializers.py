from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['phone_number', 'national_code']  # حذف username و password از فیلدها

    def create(self, validated_data):
        # ساخت کاربر با استفاده از phone_number و national_code
        user = User.objects.create(
            phone_number=validated_data['phone_number'],
            national_code=validated_data['national_code']
        )
        return user
