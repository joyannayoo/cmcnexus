# Generated by Django 3.0.4 on 2020-04-10 23:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cases', '0002_auto_20200410_1333'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='case',
            options={'permissions': [('validate', 'Can validate cases'), ('close', 'Can close cases'), ('reject', 'Can reject cases')]},
        ),
    ]