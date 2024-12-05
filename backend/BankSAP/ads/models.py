from django.db import models
from django.utils import timezone

class Advertisement(models.Model):
    title = models.CharField(max_length=255)  
    description = models.TextField() 
    link = models.URLField(null=True, blank=True)  
    start_date = models.DateField()  
    end_date = models.DateField()  
    is_active = models.BooleanField(default=True)  

    def is_current(self):
        today = timezone.now().date()
        return self.is_active and self.start_date <= today <= self.end_date

    def __str__(self):
        return self.title


