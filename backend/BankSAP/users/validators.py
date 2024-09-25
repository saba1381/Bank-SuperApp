from django.core.exceptions import ValidationError
import re

class CustomPasswordValidator:
    def validate(self, password, user=None):
        errors = []  

        if not any(char.isupper() for char in password):
            errors.append("رمز عبور باید حداقل یک حرف بزرگ داشته باشد.")

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("رمز عبور باید  حداقل شامل کاراکترهای خاص باشد.")

        if password.isdigit():
            errors.append("رمز عبور نمی‌تواند فقط شامل اعداد باشد.")

        if errors:
            raise ValidationError(" ".join(errors))  

    def get_help_text(self):
        return "رمز عبور باید شامل حداقل یک حرف بزرگ و یک کاراکتر خاص باشد."
