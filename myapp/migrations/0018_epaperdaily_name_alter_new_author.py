# Generated by Django 4.0.1 on 2024-10-11 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0017_alter_category_category_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='epaperdaily',
            name='name',
            field=models.CharField(default='E Paper Daily', max_length=255),
        ),
        migrations.AlterField(
            model_name='new',
            name='author',
            field=models.CharField(default='Gujarat Today', max_length=100),
        ),
    ]