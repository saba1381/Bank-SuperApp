# Generated by Django 4.2.15 on 2024-10-16 03:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0006_alter_card_expiration_month_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='balance',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True),
        ),
        migrations.AddField(
            model_name='card',
            name='cvv2',
            field=models.CharField(blank=True, max_length=4, null=True),
        ),
    ]
