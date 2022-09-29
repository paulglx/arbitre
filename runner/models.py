from django.db import models

# Create your models here.
class Exercise(models.Model):
    """
    The exercise given to the student
    """
    title = models.CharField(max_length=255)
    statement = models.TextField()

    def __str__(self):
        return self.title

class Test(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    rules = models.JSONField()
    
class Submission(models.Model):
    """
    The code file stored that will be judged
    """
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    file = models.FileField(upload_to="fileuploads")
    owner = models.CharField(max_length=255, default="John Doe")

    def __str__(self):
        return self.file.name

class TestResult(models.Model):
    """
    A test, ran on a file
    """
    file = models.ForeignKey(Submission, on_delete=models.CASCADE)
    exercise_test = models.ForeignKey(Test, on_delete=models.CASCADE)
    success = models.BooleanField(default=False)
    time = models.FloatField()
    memory = models.IntegerField()
