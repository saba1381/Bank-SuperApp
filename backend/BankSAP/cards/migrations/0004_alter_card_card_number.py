# Generated by Django 4.2.15 on 2024-10-02 06:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0003_card_bank_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='card_number',
            field=models.CharField(default='0000000000000000', max_length=16, unique=True),
        ),
    ]
