# Generated by Django 4.1.1 on 2022-10-14 09:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("api", "__first__"),
        ("runner", "0016_alter_submission_file"),
    ]

    operations = [
        migrations.AlterField(
            model_name="submission",
            name="exercise",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="api.exercise"
            ),
        ),
        migrations.AlterField(
            model_name="submission",
            name="owner",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AlterField(
            model_name="test",
            name="exercise",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="api.exercise"
            ),
        ),
        migrations.DeleteModel(
            name="Exercise",
        ),
    ]
