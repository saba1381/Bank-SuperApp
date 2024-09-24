from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['phone_number', 'national_code', 'first_name', 'last_name','gender','email' ,'password' ,'profile_image']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            phone_number=validated_data['phone_number'],
            national_code=validated_data['national_code'],
            first_name=validated_data.get('first_name', None),
            last_name=validated_data.get('last_name', None),
        )
        user.set_password(validated_data['password'])  #hashing the password
        user.save()
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
