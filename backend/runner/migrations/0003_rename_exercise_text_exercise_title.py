# Generated by Django 4.1.1 on 2022-09-27 09:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("runner", "0002_rename_title_exercise_exercise_text"),
    ]

    operations = [
        migrations.RenameField(
            model_name="exercise",
            old_name="exercise_text",
            new_name="title",
        ),
    ]
