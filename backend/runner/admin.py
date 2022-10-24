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
    fields = ["owner", "title", "description", "students"]
    filter_horizontal = [
        "students",
    ]


admin.site.register(Submission)
admin.site.register(TestResult)

admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Session)
admin.site.register(Course, CourseAdmin)
