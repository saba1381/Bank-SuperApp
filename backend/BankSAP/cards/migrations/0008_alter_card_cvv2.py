# Generated by Django 4.2.15 on 2024-10-16 04:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0007_card_balance_card_cvv2'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='cvv2',
            field=models.CharField(blank=True, max_length=3, null=True),
        ),
    ]
