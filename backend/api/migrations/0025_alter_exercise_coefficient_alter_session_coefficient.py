# Generated by Django 4.1.4 on 2023-11-28 17:35

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0024_remove_session_late_penalty_between_0_and_1_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="exercise",
            name="coefficient",
            field=models.FloatField(default=1),
        ),
        migrations.AlterField(
            model_name="session",
            name="coefficient",
            field=models.FloatField(default=1),
        ),
    ]
