from django.contrib import admin
from .models import Submission, Exercise, Test, TestResult

# Register your models here.

class TestInline(admin.StackedInline):
    model = Test
    extra = 1
class ExerciseAdmin(admin.ModelAdmin):
    fields = ['title','statement']
    inlines = [TestInline]

admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Submission)
admin.site.register(TestResult)