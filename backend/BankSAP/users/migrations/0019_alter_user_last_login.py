# Generated by Django 4.2.15 on 2024-10-18 12:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0018_alter_user_last_login'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='last_login',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
