# Generated by Django 4.2.15 on 2024-10-16 05:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0008_alter_card_cvv2'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='first_name',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='card',
            name='last_name',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
