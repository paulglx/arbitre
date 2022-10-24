from api.models import Exercise
from django.contrib.auth.models import User
from django.db import models

from .tasks import run_camisole


class Submission(models.Model):
    """
    The stored code file that will be judged
    """

    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    file = models.FileField(upload_to="uploads")
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.file.name

    def save(self, *args, **kwargs):

        # Save submission to database
        super(Submission, self).save(*args, **kwargs)

        tests = Test.objects.filter(exercise=self.exercise)

        with self.file.open(mode="rb") as f:
            file_content = f.read().decode()

            for test in tests:
                # Add camisole task to queue
                run_camisole.delay(
                    submission_id=self.id, test_id=test.id, file_content=file_content
                )

    class Meta:
        unique_together = ("exercise", "owner")


# Create your models here
class Test(models.Model):

    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, default="")
    stdin = models.TextField(default="")
    stdout = models.TextField(default="")
    # TODO add all test criterias

    def __str__(self):
        return self.name + " (" + str(self.exercise) + ")"


class TestResult(models.Model):
    """
    A test, ran on a file
    """

    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    exercise_test = models.ForeignKey(Test, on_delete=models.CASCADE)
    running = models.BooleanField(default=False)
    stdout = models.CharField(max_length=255, default="")
    success = models.BooleanField(default=False)
    time = models.FloatField(default=-1)
    memory = models.IntegerField(default=-1)

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
