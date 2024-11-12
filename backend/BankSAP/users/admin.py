from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

class UserAdmin(BaseUserAdmin):

    list_display = ('username', 'phone_number', 'national_code', 'first_name', 'last_name')
    search_fields = ('username', 'phone_number', 'national_code', 'first_name', 'last_name')
    readonly_fields = ('last_login',)

    list_filter = ('is_customer', 'is_superuser', 'gender', 'last_login')

    fieldsets = (
        (None, {'fields': ('username', 'phone_number', 'national_code', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email', 'gender', 'profile_image')}),
        (_('Permissions'), {'fields': ('is_customer', 'is_superuser', 'is_staff', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login',)}),
    )


    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'phone_number', 'national_code', 'password1', 'password2'),
        }),
    )

    ordering = ('username',) 


admin.site.register(User, UserAdmin)
