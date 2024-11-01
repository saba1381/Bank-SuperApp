from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone  
import jdatetime
class UserManager(BaseUserManager):
    def create_user(self, username, password=None,**extra_fields):
        if not username:
            raise ValueError('Username is required')

        user = self.model(username=username,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_customer', False)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_customer') is not False:
            raise ValueError('Superuser must have is_customer=False.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, password,**extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True , null=True, blank=True)
    phone_number = models.CharField(max_length=11, unique=True , null=True , blank=False)
    national_code = models.CharField(max_length=10, unique=True , null=True , blank=False)
    first_name = models.CharField(max_length=30, blank=True, null=True)  
    last_name = models.CharField(max_length=30, blank=True, null=True) 
    email = models.EmailField(max_length=255, unique=False, null=True, blank=True)  
    gender = models.CharField(max_length=10, choices=[('male', 'مرد'), ('female', 'زن')], blank=True, null=True)
    last_login = models.DateTimeField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    is_customer = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    

    USERNAME_FIELD = 'username'
    #REQUIRED_FIELDS = ['phone_number']

    objects = UserManager()


    def __str__(self):
        return self.phone_number
