from django.db import models
from .courseModel import Course


class Session(models.Model):
    """
    A part of a course, that includes exercises
    """

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    grade = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.course.title + " : " + self.title
