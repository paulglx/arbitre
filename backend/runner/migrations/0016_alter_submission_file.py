# Generated by Django 4.1.1 on 2022-10-12 10:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("runner", "0015_alter_testresult_memory_alter_testresult_time"),
    ]

    operations = [
        migrations.AlterField(
            model_name="submission",
            name="file",
            field=models.FileField(upload_to="uploads"),
        ),
    ]