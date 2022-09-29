from django.contrib import admin
from .models import Submission, Exercise, Test, TestResult

# Register your models here.
class SubmissionInline(admin.StackedInline):
    model = Submission
    extra = 1

class TestInline(admin.StackedInline):
    model = Test
    extra = 1
class ExerciseAdmin(admin.ModelAdmin):
    fields = ['title','statement']
    inlines = [TestInline, SubmissionInline]

admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(TestResult)