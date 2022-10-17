from django.template import loader
from django.http import HttpResponse, JsonResponse
from rest_framework import renderers, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from runner.serializers import *
from .models import *

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer

    def get_queryset(self):
        exercise_id = self.request.query_params.get('exercise_id')
        owner = self.request.query_params.get('owner')
        if (exercise_id and owner):
            return self.queryset.filter(submission__exercise_id=exercise_id, submission__owner=owner)
        return super().get_queryset()

def results(request, submission_id):
    template = loader.get_template('runner/index.html')

    submission = Submission.objects.get(pk=submission_id)
    exercise = Exercise.objects.get(pk=submission.exercise.id)

    test_results = TestResult.objects.filter(submission=submission)

    page_context:dict = {}

    page_context["submission_id"] = submission_id
    page_context["filename"] = submission.file.path.split("/")[-1] 
    page_context["exercise"] = exercise.title
    page_context["statement"] = exercise.statement
    page_context["owner"] = submission.owner
    page_context["test_results"] = test_results

    return HttpResponse(template.render(page_context, request))
