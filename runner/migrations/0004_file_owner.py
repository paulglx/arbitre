# Generated by Django 4.1.1 on 2022-09-28 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("runner", "0003_rename_exercise_text_exercise_title"),
    ]

    operations = [
        migrations.AddField(
            model_name="file",
            name="owner",
            field=models.CharField(default="John Doe", max_length=255),
        ),
    ]
