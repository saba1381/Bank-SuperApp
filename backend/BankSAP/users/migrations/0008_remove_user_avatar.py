# Generated by Django 4.2.15 on 2024-09-16 14:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_user_avatar'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='avatar',
        ),
    ]
