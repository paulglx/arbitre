from api.models import Exercise
from django.db import models


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
