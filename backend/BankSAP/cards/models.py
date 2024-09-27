from django.db import models
from django.conf import settings

class Card(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # ارتباط با کاربر
    card_number = models.CharField(max_length=16, unique=True)  # شماره کارت (یکتا)
    full_name = models.CharField(max_length=100)  # نام و نام خانوادگی
    expiration_month = models.CharField(max_length=2)  # ماه انقضا (MM)
    expiration_year = models.CharField(max_length=2)  # سال انقضا (YY)
    bank_name = models.CharField(max_length=50, blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cards')

    def __str__(self):
        return f"{self.full_name} - {self.card_number}"
