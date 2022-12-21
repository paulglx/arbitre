from django.contrib import admin
from .models import Submission, Test, TestResult
from api.models import Exercise, Session, Course

# Register your models here.


class TestInline(admin.StackedInline):
    model = Test
    extra = 1


class ExerciseAdmin(admin.ModelAdmin):
    fields = ["session", "title", "description"]
    inlines = [TestInline]


class CourseAdmin(admin.ModelAdmin):
    fields = [
        "title",
        "description",
        "join_code",
        "join_code_enabled",
        "students",
        "owners",
        "tutors",
        "language",
    ]
    filter_horizontal = [
        "students",
        "owners",
        "tutors",
    ]


admin.site.register(Submission)
admin.site.register(TestResult)

admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Session)
admin.site.register(Course, CourseAdmin)
