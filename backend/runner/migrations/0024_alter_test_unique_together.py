# Generated by Django 4.1.4 on 2023-07-22 16:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0017_alter_course_groups_enabled"),
        ("runner", "0023_alter_test_stdin_alter_test_stdout"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="test",
            unique_together={("exercise", "name")},
        ),
    ]