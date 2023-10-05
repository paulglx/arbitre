from api.models import Exercise
from celery import Celery
from django.contrib.auth.models import User
from django.db import models
from django.utils.translation import gettext_lazy as _
from .testResultModel import TestResult
from .testModel import Test


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

        prefix = exercise.prefix
        suffix = exercise.suffix

        if tests:
            super(Submission, self).save(*args, **kwargs)

            with self.file.open(mode="rb") as f:
                file_content = f.read().decode()
                for test in tests:
                    # Add camisole task to queue
                    celery.send_task(
                        "arbitre.tasks.run_camisole",
                        (
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
