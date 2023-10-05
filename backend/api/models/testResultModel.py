from datetime import timedelta

from celery import Celery
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .submissionModel import Submission
from .testModel import Test


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

        print("Running all pending testresults...")

        pending_testresults = TestResult.objects.filter(
            status=TestResult.TestResultStatus.PENDING
        )

        if len(pending_testresults) == 0:
            print("No pending testresults to run")
            return

        for testresult in pending_testresults:
            submission = testresult.submission
            if submission.ignore:
                continue
            exercise_test = testresult.exercise_test

            # read file content
            with open(submission.file.path, "r") as f:
                file_content = f.read()

            lang = submission.exercise.session.course.language
            prefix = submission.exercise.prefix
            suffix = submission.exercise.suffix

            # if submission created more than 1 minute ago
            if submission.created < timezone.now() - timedelta(minutes=1):
                # Add camisole task to queue
                celery.send_task(
                    "arbitre.tasks.run_camisole",
                    (
                        submission.id,
                        exercise_test.id,
                        file_content,
                        prefix,
                        suffix,
                        lang,
                    ),
                )

        print(f"Ran {len(pending_testresults)} pending testresults")
