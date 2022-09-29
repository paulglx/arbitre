import json
from django.db import models
import requests


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
    rules = models.TextField()
    
class Submission(models.Model):
    """
    The code file stored that will be judged
    """
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    file = models.FileField(upload_to="fileuploads")
    owner = models.CharField(max_length=255, default="John Doe")

    def __str__(self):
        return self.file.name

    def save(self, *args, **kwargs):

        super(Submission, self).save(*args, **kwargs)

        url = "http://oasis:1234/run"
        submission = self
        filename = submission.file.path
        #tests_object = json.loads(exercise.tests)
        test_objects = [dic["rules"] for dic in list(Test.objects.all().values('rules'))]

        test_object = json.loads(test_objects[0])

        data = {}
        data['lang'] = 'python'
        data.update(test_object) #only run the first test : this is temporary !
        with open(filename, 'r') as f:
            data['source'] = f.read()

        r = requests.post(url, json=data)
        camisole_response = json.loads(r.text)

        test_results = []

        for test in camisole_response["tests"]:
            expected_stdout = next(initial_test for initial_test in test_object["tests"] if initial_test["name"] == test["name"])["stdout"]
            test_results.append(test)

            existing_result = TestResult.objects.filter(submission = submission, exercise_test = Test.objects.all()[0])

            test_result = TestResult(
                id = existing_result.first().id if existing_result else None,
                submission = submission,
                exercise_test = Test.objects.all()[0],
                stdout = test["stdout"],
                success = test["stdout"] == expected_stdout,
                time = round(test["meta"]["wall-time"],2),
                memory = test["meta"]["cg-mem"]
            )
            test_result.save()

class TestResult(models.Model):
    """
    A test, ran on a file
    """
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    exercise_test = models.ForeignKey(Test, on_delete=models.CASCADE)
    stdout = models.CharField(max_length=255, default="")
    success = models.BooleanField(default=False)
    time = models.FloatField()
    memory = models.IntegerField()

    class Meta:
        unique_together = ('submission','exercise_test')
