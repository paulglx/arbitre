from django.db import models
from django.contrib.auth.models import User


class Course(models.Model):
    """
    A course, that includes sessions, owned by a teacher
    """

    owners = models.ManyToManyField(
        User,
        related_name="%(class)s_courses_owners",
    )
    tutors = models.ManyToManyField(
        User,
        related_name="%(class)s_courses_tutors",
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    students = models.ManyToManyField(
        User, related_name="%(class)s_courses_students", blank=True
    )

    def __str__(self):
        return self.title


class Session(models.Model):
    """
    A part of a course, that includes exercises
    """

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.course.title + " : " + self.title


class Exercise(models.Model):
    """
    The exercise given to the student
    """

    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title
