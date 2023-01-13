from api.models import Exercise
from django.contrib.auth.models import User
from django.db import models
from django.utils.translation import gettext_lazy as _
from arbitre.tasks import run_camisole, dummy_run_camisole
from celery import Celery
from django.utils import timezone
from datetime import timedelta

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

    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    file = models.FileField(upload_to="uploads")
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=10,
        choices=SubmissionStatus.choices,
        default=SubmissionStatus.PENDING,
    )
    created = models.DateTimeField(auto_now=True)

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

        print("Gettin courses and tests")

        celery = Celery("arbitre", include=["arbitre.tasks"])

        course = self.exercise.session.course
        tests = Test.objects.filter(exercise=self.exercise)

        print("Course and tests gotten")

        if tests:
            print("Running super save")
            super(Submission, self).save(*args, **kwargs)
            print("Opening file")

            with self.file.open(mode="rb") as f:
                file_content = f.read().decode()
                print("Read file")
                for test in tests:

                    print("Adding one task to queue")
                    # Add camisole task to queue
                    celery.send_task(
                        'arbitre.tasks.run_camisole',
                        (
                            self.id,
                            test.id,
                            file_content,
                            course.language,
                        )
                    )
                    print("One task added")
        else:
            print("There was no tests to run. Success!")
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
    # TODO add all test criterias

    def __str__(self):
        return self.name + " (" + str(self.exercise) + ")"


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
            exercise_test = testresult.exercise_test

            # read file content
            with open(submission.file.path, "r") as f:
                file_content = f.read()

            lang = submission.exercise.session.course.language

            # if submission created more than 5 minutes ago
            if submission.created < timezone.now() - timedelta(minutes=1):
                # Add camisole task to queue
                celery.send_task(
                    "arbitre.tasks.run_camisole",
                    (
                        submission.id,
                        exercise_test.id,
                        file_content,
                        lang,
                    )
                )

        print(f"Ran {len(pending_testresults)} pending testresults")

