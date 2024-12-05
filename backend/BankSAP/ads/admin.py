from django.contrib import admin
from .models import Advertisement

@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_date', 'end_date', 'is_active')   
    list_filter = ('is_active', 'start_date')  
    search_fields = ('title', 'description')
    ordering = ('-start_date',)  
