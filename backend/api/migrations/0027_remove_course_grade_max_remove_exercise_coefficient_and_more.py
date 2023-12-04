# Generated by Django 4.1.4 on 2023-11-28 18:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0026_remove_session_coefficient"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="course",
            name="grade_max",
        ),
        migrations.RemoveField(
            model_name="exercise",
            name="coefficient",
        ),
        migrations.AddField(
            model_name="exercise",
            name="grade",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="session",
            name="grade",
            field=models.FloatField(blank=True, null=True),
        ),
    ]
