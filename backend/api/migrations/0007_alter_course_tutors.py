# Generated by Django 4.1.2 on 2022-11-25 08:40

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("api", "0006_course_language"),
    ]

    operations = [
        migrations.AlterField(
            model_name="course",
            name="tutors",
            field=models.ManyToManyField(
                blank=True,
                related_name="%(class)s_courses_tutors",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
