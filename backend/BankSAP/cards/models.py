from django.db import models
from django.conf import settings
import hashlib
class Card(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cards')  
    card_number = models.CharField(max_length=16, unique=True , blank=True , null=True)  
    full_name = models.CharField(max_length=100)  
    first_name = models.CharField(max_length=50, blank=True, null=True)  
    last_name = models.CharField(max_length=50, blank=True, null=True)
    expiration_month = models.CharField(max_length=2, blank=True , null=True)  
    expiration_year = models.CharField(max_length=2, blank=True , null=True)
    bank_name = models.CharField(max_length=50, blank=True, null=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True) 
    cvv2 = models.CharField(max_length=3, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        cvv2 = kwargs.pop('cvv2', None)
        if cvv2 and (len(cvv2) != 3 or not cvv2.isdigit()):
            raise ValueError("CVV2 باید یک عدد 3 رقمی باشد")

        if cvv2:
            self.cvv2_hashed = hashlib.sha256(cvv2.encode()).hexdigest()
        
        super(Card, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} - {self.card_number}"
