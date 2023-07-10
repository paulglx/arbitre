from django.contrib import admin
from .models import Submission, Test, TestResult
from api.models import Exercise, Session, Course


# Register your models here.
class TestInline(admin.StackedInline):
    model = Test
    extra = 1


class ExerciseAdmin(admin.ModelAdmin):
    fields = ["session", "title", "description", "prefix", "suffix"]
    inlines = [TestInline]


class SubmissionAdmin(admin.ModelAdmin):
    fields = ["exercise", "owner", "file", "created", "status"]
    readonly_fields = ["file", "created"]
    list_display = ["exercise", "owner", "status", "created"]
    list_filter = ["status", "exercise", "owner", "created"]
    search_fields = ["exercise", "owner", "status"]


class CourseAdmin(admin.ModelAdmin):
    fields = [
        "id",
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
    readonly_fields = ["id"]
    list_display = ["title", "id", "join_code"]


class TestResultAdmin(admin.ModelAdmin):
    fields = ["status", "id", "submission", "exercise_test", "stdout"]
    readonly_fields = ["id", "submission", "exercise_test", "stdout"]
    list_display = ["id", "submission", "status", "exercise_test", "stdout"]
    list_filter = ["status"]


admin.site.register(Submission, SubmissionAdmin)
admin.site.register(TestResult, TestResultAdmin)

admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Session)
admin.site.register(Course, CourseAdmin)
