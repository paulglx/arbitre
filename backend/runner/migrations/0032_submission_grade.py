# Generated by Django 4.2.7 on 2024-11-14 11:21

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("runner", "0031_alter_testresult_submission"),
    ]

    operations = [
        migrations.AddField(
            model_name="submission",
            name="grade",
            field=models.FloatField(blank=True, null=True),
        ),
    ]