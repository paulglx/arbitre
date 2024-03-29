# Generated by Django 4.1.1 on 2022-10-17 07:22

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("runner", "0017_alter_submission_exercise_alter_submission_owner_and_more"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="submission",
            unique_together={("exercise", "owner")},
        ),
    ]
