from django.core.exceptions import ValidationError
import re

class CustomPasswordValidator:
    def validate(self, password, user=None):
        errors = []  # لیستی برای ذخیره خطاها

        # چک کردن اینکه آیا رمز عبور حاوی حداقل یک حرف بزرگ است
        if not any(char.isupper() for char in password):
            errors.append("رمز عبور باید حداقل یک حرف بزرگ داشته باشد.")

        # چک کردن اینکه آیا رمز عبور شامل کاراکترهای خاص است
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("رمز عبور باید شامل کاراکترهای خاص باشد.")

        # چک کردن اینکه آیا رمز عبور فقط شامل اعداد است
        if password.isdigit():
            errors.append("رمز عبور نمی‌تواند فقط شامل اعداد باشد.")

        # اگر خطاهایی وجود دارد، یک ValidationError با آن‌ها بسازید
        if errors:
            raise ValidationError(" ".join(errors))  # پیغام را به صورت یک رشته برمی‌گردانیم

    def get_help_text(self):
        return "رمز عبور باید شامل حداقل یک حرف بزرگ و یک کاراکتر خاص باشد."
