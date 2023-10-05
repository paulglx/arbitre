from django.contrib.auth.models import User
from django.db import models


class StudentGroup(models.Model):
    """
    A group of students, related to one course.
    """

    course = models.ForeignKey("api.Course", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    students = models.ManyToManyField(
        User, related_name="%(class)s_students", blank=True
    )

    def save(self, *args, **kwargs):
        is_new = self._state.adding

        super(StudentGroup, self).save(*args, **kwargs)

        if is_new:
            self.course.handle_student_groups_change()

    def delete(self, *args, **kwargs):
        super(StudentGroup, self).delete(*args, **kwargs)
        self.course.handle_student_groups_change()

    def __str__(self):
        return f"{self.name} ({self.course.title})"
