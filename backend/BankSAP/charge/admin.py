from django.contrib import admin
from .models import Recharge

@admin.register(Recharge)
class RechargeAdmin(admin.ModelAdmin):
    list_display = ('user', 'mobile_number', 'amount', 'timestamp', 'status')
    list_filter = ('status', 'timestamp')
    search_fields = ('user__username', 'mobile_number')
