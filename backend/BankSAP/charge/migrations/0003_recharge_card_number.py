# Generated by Django 4.2.15 on 2024-11-05 02:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('charge', '0002_recharge_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='recharge',
            name='card_number',
            field=models.CharField(default='', max_length=16),
        ),
    ]
