from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

class UserAdmin(BaseUserAdmin):
    # تنظیمات نمایش فیلدها در لیست کاربران در پنل ادمین
    list_display = ('username','phone_number', 'national_code', 'first_name', 'last_name')
    search_fields = ('phone_number', 'national_code', 'first_name', 'last_name')
    readonly_fields = ('last_login',)

    # فیلترهایی که در پنل ادمین نشان داده می‌شود
    list_filter = ('is_customer', 'is_superuser', 'gender')

    # تنظیمات نمایش فیلدها در فرم کاربر
    fieldsets = (
        (None, {'fields': ('phone_number', 'national_code', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email', 'gender', 'profile_image')}),
        (_('Permissions'), {'fields': ('is_customer', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login',)}),
    )

    # تنظیمات فرم اضافه کردن کاربر جدید
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone_number', 'national_code', 'password1', 'password2'),
        }),
    )

    ordering = ('phone_number',)  # ترتیب نمایش کاربران

# ثبت مدل کاربر در پنل ادمین
admin.site.register(User, UserAdmin)
