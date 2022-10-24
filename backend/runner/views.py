from rest_framework import viewsets
from .models import Submission, Test, TestResult
from runner.serializers import (
    SubmissionSerializer,
    TestResultSerializer,
    TestSerializer,
)


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
        exercise_id = self.request.query_params.get("exercise_id")
        owner = self.request.query_params.get("owner")
        if exercise_id and owner:
            return self.queryset.filter(
                submission__exercise_id=exercise_id, submission__owner=owner
            )
        return super().get_queryset()
