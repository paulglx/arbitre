from django.contrib import admin
from .models import Submission, Exercise

# Register your models here.
class SubmissionInline(admin.StackedInline):
    model = Submission
    extra = 1

class ExerciseAdmin(admin.ModelAdmin):
    fields = ['title','statement','tests']
    inlines = [SubmissionInline]

admin.site.register(Exercise, ExerciseAdmin)