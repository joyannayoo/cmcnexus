# Generated by Django 3.0.4 on 2020-04-18 21:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cases', '0016_auto_20200418_1917'),
    ]

    operations = [
        migrations.AlterField(
            model_name='case',
            name='nature_of_referral',
            field=models.CharField(choices=[('Emergency', 'Emergency'), ('Urgent', 'Urgent'), ('Life changing', 'Life changing')], default='', max_length=20),
        ),
    ]
