from django.contrib import admin
from .models import Card , CardToCard
@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('get_username','bank_name', 'card_number')

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'username' 


@admin.register(CardToCard)
class CardToCardAdmin(admin.ModelAdmin):
    list_display = ('get_username', 'initialCard', 'desCard', 'amount', 'created_date')  
    list_filter = ('user', 'created_at')  
    search_fields = ('user__username', 'initialCard', 'desCard')

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'username'  