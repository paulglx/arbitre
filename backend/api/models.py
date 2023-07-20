from django.contrib.auth.models import User
from django.db import models
from django.utils.translation import gettext_lazy as _


class Course(models.Model):
    """
    A course, that includes sessions, owned by a teacher
    """

    class Languages(models.TextChoices):
        ADA = "ada", _("Ada")
        C = "c", _("C")
        CPP = "c++", _("C++")
        CSHARP = "c#", _("C#")
        D = "d", _("D")
        GO = "go", _("Go")
        HASKELL = "haskell", _("Haskell")
        JAVA = "java", _("Java")
        JAVASCRIPT = "javascript", _("JavaScript")
        LUA = "lua", _("Lua")
        OCAML = "ocaml", _("OCaml")
        PASCAL = "pascal", _("Pascal")
        PERL = "perl", _("Perl")
        PHP = "php", _("PHP")
        PROLOG = "prolog", _("Prolog")
        PYTHON = "python", _("Python")
        RUBY = "ruby", _("Ruby")
        RUST = "rust", _("Rust")
        SCHEME = "scheme", _("Scheme")

    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    language = models.CharField(
        max_length=10,
        choices=Languages.choices,
        default=Languages.PYTHON,
    )

    students = models.ManyToManyField(
        User, related_name="%(class)s_courses_students", blank=True
    )
    owners = models.ManyToManyField(
        User,
        related_name="%(class)s_courses_owners",
    )
    tutors = models.ManyToManyField(
        User,
        related_name="%(class)s_courses_tutors",
        blank=True,
    )
    join_code = models.CharField(max_length=8, blank=False, default="00000000")
    join_code_enabled = models.BooleanField(default=True)

    groups_enabled = models.BooleanField(default=False)

    auto_groups_enabled = models.BooleanField(default=False)
    auto_groups_type = models.CharField(
        max_length=12,
        choices=[
            ("alphabetical", _("Alphabetical")),
            # ("random", _("Random")), ##TODO add random groups
        ],
        default="alphabetical",
    )

    def __str__(self):
        return self.title

    def handle_student_groups_change(self, *args, **kwargs):
        former_course = Course.objects.get(pk=self.pk)
        former_student_groups = StudentGroup.objects.filter(course=self)

        super(Course, self).save(*args, **kwargs)

        new_course = Course.objects.get(pk=self.pk)
        new_student_groups = StudentGroup.objects.filter(course=self)

        if self.auto_groups_enabled and (
            former_course.auto_groups_enabled != new_course.auto_groups_enabled
            or former_course.students != new_course.students
            or former_student_groups != new_student_groups
        ):
            self.make_auto_groups()

    def save(self, *args, **kwargs):
        if self.pk is not None:
            self.handle_student_groups_change(*args, **kwargs)
        super(Course, self).save(*args, **kwargs)

    def make_auto_groups(self):
        """
        Create groups of students, ordered alphabetically by username.
        """

        # Get groups
        student_groups = StudentGroup.objects.filter(course=self).order_by("name")

        # Empty groups
        for group in student_groups:
            group.students.clear()

        # Get students
        students = list(self.students.all().order_by("username"))
        number_of_groups = StudentGroup.objects.filter(course=self).count()

        # Evenly distribute students into groups
        group_repartition = [
            len(students) // number_of_groups
            + (1 if x < len(students) % number_of_groups else 0)
            for x in range(number_of_groups)
        ]

        # Put students into groups according to repartition
        for i in range(number_of_groups):
            for j in range(group_repartition[i]):
                student_groups[i].students.add(students.pop(0))

        # Save groups
        for group in student_groups:
            group.save()


class StudentGroup(models.Model):
    """
    A group of students, related to one course.
    """

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
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


class Session(models.Model):
    """
    A part of a course, that includes exercises
    """

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.course.title + " : " + self.title


class Exercise(models.Model):
    """
    The exercise given to the student
    """

    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    prefix = models.TextField(blank=True)
    suffix = models.TextField(blank=True)

    def __str__(self):
        return self.title
