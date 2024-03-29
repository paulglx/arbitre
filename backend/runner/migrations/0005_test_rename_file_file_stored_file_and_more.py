# Generated by Django 4.1.1 on 2022-09-28 15:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("runner", "0004_file_owner"),
    ]

    operations = [
        migrations.CreateModel(
            name="Test",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("rules", models.JSONField()),
            ],
        ),
        migrations.RenameField(
            model_name="file",
            old_name="file",
            new_name="stored_file",
        ),
        migrations.RemoveField(
            model_name="exercise",
            name="tests",
        ),
        migrations.CreateModel(
            name="TestResult",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("success", models.BooleanField(default=False)),
                ("time", models.FloatField()),
                ("memory", models.IntegerField()),
                (
                    "exercise_test",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="runner.test"
                    ),
                ),
                (
                    "file",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="runner.file"
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="test",
            name="exercise",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="runner.exercise"
            ),
        ),
    ]
