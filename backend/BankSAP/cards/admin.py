from django.contrib import admin
from .models import Card  # ایمپورت کردن مدل کارت

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('first_name','last_name', 'card_number')
