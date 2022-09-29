from enum import auto
from django.template import loader
from django.http import HttpResponse
from rest_framework import permissions, renderers, viewsets
from rest_framework.decorators import action

from runner.serializers import *
from .models import *
import requests
import json

class ExerciseViewSet(viewsets.ModelViewSet):
    """
    List all exercises (GET), or create a new exercise (POST).
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

    @action(detail=True, renderer_classes=[renderers.StaticHTMLRenderer])
    def refresh(self, request, *args, **kwargs):
        submission = self.get_object()
        submission.save()

        

def results(request, submission_id):
    template = loader.get_template('runner/index.html')

    submission = Submission.objects.get(pk=submission_id)
    exercise = Exercise.objects.get(pk=submission.exercise.id)

    test_results = TestResult.objects.filter(submission=submission)
    print(test_results.values())

    page_context:dict = {}

    page_context["submission_id"] = submission_id
    page_context["filename"] = submission.file.path.split("/")[-1] 
    page_context["exercise"] = exercise.title
    page_context["statement"] = exercise.statement
    page_context["owner"] = submission.owner
    page_context["test_results"] = test_results

    return HttpResponse(template.render(page_context, request))
