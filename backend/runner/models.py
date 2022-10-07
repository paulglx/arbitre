import json
from django.db import models
import requests
from .tasks import run_camisole

# Create your models here.
class Exercise(models.Model):
    """
    The exercise given to the student
    """

    title = models.CharField(max_length=255)
    statement = models.TextField()

    def __str__(self):
        return self.title


class Submission(models.Model):
    """
    The stored code file that will be judged
    """

    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    file = models.FileField(upload_to="fileuploads")
    owner = models.CharField(max_length=255, default="John Doe")

    def __str__(self):
        return self.file.name

    def save(self, *args, **kwargs):

        # Save submission to database
        super(Submission, self).save(*args, **kwargs)

        tests = Test.objects.filter(exercise=self.exercise)

        for test in tests:
            # Add camisole task to queue
            run_camisole.delay(submission_id=self.id, test_id=test.id)


class Test(models.Model):

    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, default="")
    stdin = models.TextField(default="")
    stdout = models.TextField(default="")
    #TODO add all test criterias

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
        return self.submission.exercise.title + " : " + self.exercise_test.name + " (" + str(self.submission.owner) + ")"
