# Generated by Django 4.2.15 on 2024-11-01 05:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0022_savedcard'),
    ]

    operations = [
        migrations.AddField(
            model_name='cardtocard',
            name='status',
            field=models.BooleanField(default=False),
        ),
    ]
