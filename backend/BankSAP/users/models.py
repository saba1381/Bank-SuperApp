from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone  

class UserManager(BaseUserManager):
    def create_user(self, phone_number, national_code, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('Phone number is required')
        if not national_code:
            raise ValueError('National code is required')

        user = self.model(phone_number=phone_number, national_code=national_code, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, national_code, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(phone_number, national_code, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    phone_number = models.CharField(max_length=11, unique=True , null=False , blank=False)
    national_code = models.CharField(max_length=10, unique=True , null=False , blank=False)
    first_name = models.CharField(max_length=30, blank=False, null=False)  
    last_name = models.CharField(max_length=30, blank=False, null=False) 
    email = models.EmailField(max_length=255, unique=False, null=True, blank=True)  
    gender = models.CharField(max_length=10, choices=[('male', 'مرد'), ('female', 'زن')], blank=True, null=True)
    last_login = models.DateTimeField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    USERNAME_FIELD = 'national_code'
    REQUIRED_FIELDS = ['phone_number']

    objects = UserManager()

    def __str__(self):
        return self.phone_number
