from django.db import models
from django.utils import timezone

class Advertisement(models.Model):
    title = models.CharField(max_length=200, blank=False, null=False)  
    description = models.TextField(blank=False, null=False) 
    link = models.URLField(null=True, blank=True)  
    start_date = models.DateField(blank=False, null=False)  
    start_time = models.TimeField(blank=True, null=True)
    end_date = models.DateField(blank=False, null=False)  
    end_time = models.TimeField(blank=True, null=True) 
    is_active = models.BooleanField(default=True)  

    def is_current(self):
        today = timezone.now().date()
        return self.is_active and self.start_date <= today <= self.end_date

    def __str__(self):
        return self.title


