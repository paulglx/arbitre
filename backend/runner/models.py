from api.models import Exercise
from celery import Celery
from datetime import timedelta
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
import environ
import os
import random


class Submission(models.Model):
    """
    The stored code file that will be judged
    """

    class SubmissionStatus(models.TextChoices):
        PENDING = "pending", _("Pending")
        RUNNING = "running", _("Running")
        SUCCESS = "success", _("Success")
        FAILED = "failed", _("Failed")
        ERROR = "error", _("Error")

    def get_file_name(instance, filename):
        path = "uploads"
        extension = instance.file.name.split(".")[-1]

        exercise = instance.exercise
        created_with_correct_timezone = timezone.localtime(instance.created)
        created_month_day_hour_minutes_seconds = created_with_correct_timezone.strftime(
            "%m-%d_%H-%M-%S"
        )

        format = (
            exercise.title[0:10]
            + "_"
            + instance.owner.username[0:10]
            + "_"
            + created_month_day_hour_minutes_seconds
            + "."
            + extension
        )

        return os.path.join(path, format)

    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    file = models.FileField(upload_to=get_file_name)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=10,
        choices=SubmissionStatus.choices,
        default=SubmissionStatus.PENDING,
    )
    created = models.DateTimeField(auto_now=True)
    ignore = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return self.file.name

    def refresh_status(self):
        # Refresh submission status
        test_results = TestResult.objects.filter(submission=self)
        status = ""
        if test_results:
            if all([result.status == "success" for result in test_results]):
                status = "success"
            elif any([result.status == "error" for result in test_results]):
                status = "error"
            elif any([result.status == "failed" for result in test_results]):
                status = "failed"
            elif any([result.status == "pending" for result in test_results]):
                status = "pending"
            else:
                status = "running"
        else:
            status = "pending"
        submission = Submission.objects.filter(pk=self.id)
        submission.update(status=status)

    def save(self, *args, **kwargs):
        if self.ignore:
            super(Submission, self).save(*args, **kwargs)
            return

        celery = Celery("arbitre", include=["arbitre.tasks"])

        exercise = self.exercise
        course = exercise.session.course
        tests = Test.objects.filter(exercise=self.exercise)

        type = exercise.type

        prefix = exercise.prefix
        suffix = exercise.suffix

        # Read env
        env = environ.Env()
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        environ.Env.read_env(env_file=env_file)

        # decide Judge0 host to use
        hosts = env.list("JUDGE0_HOSTNAMES", default=["localhost"])
        host = random.choice(hosts)

        if tests:
            super(Submission, self).save(*args, **kwargs)

            file_content = ""
            with self.file.open(mode="rb") as f:
                file_content = f.read().decode()

            for test in tests:
                # Add Judge0 task to queue
                celery.send_task(
                    "arbitre.tasks.run_test",
                    (
                        host,
                        type,
                        self.id,
                        test.id,
                        file_content,
                        prefix,
                        suffix,
                        course.language,
                    ),
                )
        else:
            self.status = "success"
            super(Submission, self).save(*args, **kwargs)

    class Meta:
        unique_together = ("exercise", "owner")


# Create your models here
class Test(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, default="")
    stdin = models.TextField(default="", blank=True)
    stdout = models.TextField(default="", blank=True)
    coefficient = models.IntegerField(blank=True, null=True, default=1)
    # TODO add all test criterias

    def __str__(self):
        return self.name + " (" + str(self.exercise) + ")"

    class Meta:
        unique_together = ("exercise", "name")


class TestResult(models.Model):
    """
    A test, ran on a file
    """

    class TestResultStatus(models.TextChoices):
        PENDING = "pending", _("Pending")
        RUNNING = "running", _("Running")
        SUCCESS = "success", _("Success")
        FAILED = "failed", _("Failed")
        ERROR = "error", _("Error")

    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    exercise_test = models.ForeignKey(Test, on_delete=models.CASCADE)
    stdout = models.TextField(default="")
    time = models.FloatField(default=-1)
    memory = models.IntegerField(default=-1)
    status = models.CharField(
        max_length=10,
        choices=TestResultStatus.choices,
        default=TestResultStatus.PENDING,
    )

    class Meta:
        unique_together = ("submission", "exercise_test")

    def __str__(self):
        return (
            self.submission.exercise.title
            + " : "
            + self.exercise_test.name
            + " ("
            + str(self.submission.owner)
            + ")"
        )

    def run_all_pending_testresults():
        celery = Celery("arbitre", include=["arbitre.tasks"])

        pending_testresults = TestResult.objects.filter(
            status=TestResult.TestResultStatus.PENDING
        )

        if len(pending_testresults) == 0:
            return

        print("Running all pending testresults...")

        # Read env
        env = environ.Env()
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        environ.Env.read_env(env_file=env_file)

        # decide judge0 host to use
        hosts = env.list("JUDGE0_HOSTNAMES", default=["localhost"])
        host = random.choice(hosts)

        for testresult in pending_testresults:
            submission = testresult.submission
            if submission.ignore:
                continue
            exercise_test = testresult.exercise_test

            # read file content
            with open(submission.file.path, "r") as f:
                file_content = f.read()

            lang = submission.exercise.session.course.language
            type = submission.exercise.type
            prefix = submission.exercise.prefix
            suffix = submission.exercise.suffix

            # if submission created more than 1 minute ago
            if submission.created < timezone.now() - timedelta(seconds=10):
                # Add Judge0 task to queue
                celery.send_task(
                    "arbitre.tasks.run_test",
                    (
                        host,
                        type,
                        submission.id,
                        exercise_test.id,
                        file_content,
                        prefix,
                        suffix,
                        lang,
                    ),
                )

        print(f"Ran {len(pending_testresults)} pending testresults")
