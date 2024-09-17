from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['phone_number', 'national_code', 'first_name', 'last_name', 'email', 'gender' , 'profile_image']  

    def create(self, validated_data):
        user = User.objects.create(
            phone_number=validated_data['phone_number'],
            national_code=validated_data['national_code'],
            
        )
        return user

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.gender = validated_data.get('gender', instance.gender)
        if validated_data.get('profile_image'):
            instance.profile_image = validated_data.get('profile_image')
        instance.save()
        return instance
