# Generated by Django 4.1.1 on 2022-10-03 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("runner", "0013_test_name"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="test",
            name="rules",
        ),
        migrations.AddField(
            model_name="test",
            name="stdin",
            field=models.TextField(default=""),
        ),
        migrations.AddField(
            model_name="test",
            name="stdout",
            field=models.TextField(default=""),
        ),
    ]
