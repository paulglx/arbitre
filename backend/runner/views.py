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