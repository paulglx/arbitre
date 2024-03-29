# Generated by Django 4.1.1 on 2022-10-26 08:27

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("api", "0002_course_students_alter_course_owner"),
    ]

    operations = [
        migrations.AlterField(
            model_name="course",
            name="students",
            field=models.ManyToManyField(
                blank=True,
                related_name="%(class)s_courses_students",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
