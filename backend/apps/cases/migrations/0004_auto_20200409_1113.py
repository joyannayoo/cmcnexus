# Generated by Django 3.0.4 on 2020-04-09 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cases', '0003_auto_20200409_1033'),
    ]

    operations = [
        migrations.AlterField(
            model_name='case',
            name='age',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='case',
            name='comments',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='case',
            name='outcome',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='case',
            name='status',
            field=models.CharField(blank=True, default='', max_length=50),
        ),
    ]
