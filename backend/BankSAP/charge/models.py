from django.db import models
from django.conf import settings

class Recharge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    mobile_number = models.CharField(max_length=11)
    amount = models.DecimalField(max_digits=20, decimal_places=0)
    timestamp = models.DateTimeField(auto_now_add=True, editable=False)

    def __str__(self):
        return f'{self.user.username} - {self.mobile_number} to {self.amount}'
