from django.db import models
from .sessionModel import Session


class Exercise(models.Model):
    """
    The exercise given to the student
    """

    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    prefix = models.TextField(blank=True)
    suffix = models.TextField(blank=True)
    grade = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.title
