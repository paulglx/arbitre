from rest_framework import viewsets
from .models import Submission, Test, TestResult
from runner.serializers import (
    SubmissionSerializer,
    TestResultSerializer,
    TestSerializer,
)
from django.http import JsonResponse


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

    def perform_create(self, serializer):
        submission, created = Submission.objects.update_or_create(
            exercise_id=self.request.data["exercise"],
            owner=self.request.user,
            defaults={
                "file": self.request.data["file"],
                "status": "PENDING",
            },
        )
        submission.save()

    # Get submission for  exercise if exercise_id is given
    def get_queryset(self):
        queryset = Submission.objects.all()
        exercise_id = self.request.query_params.get("exercise_id", None)
        user = self.request.user
        if exercise_id:
            queryset = queryset.filter(exercise=exercise_id, owner=user)
        return queryset


class RefreshSubmissionViewSet(viewsets.ViewSet):
    """
    Refreshes submission status based on all test results statuses for that submission
    """

    # GET /api/refresh-submission?submission_id=...
    def list(self, request):
        try:
            submission = Submission.objects.get(
                pk=request.query_params["submission_id"]
            )
            test_results = TestResult.objects.filter(submission=submission)
            status = ""
            if test_results:
                if all([result.status == "success" for result in test_results]):
                    status = "success"
                elif any([result.status == "failed" for result in test_results]):
                    status = "failed"
                elif any([result.status == "error" for result in test_results]):
                    status = "error"
                else:
                    status = "running"
            else:
                status = "pending"
            Submission.objects.filter(pk=request.query_params["submission_id"]).update(
                status=status
            )
            return JsonResponse({"status": submission.status})
        except Submission.DoesNotExist:
            return JsonResponse({"status": "Not Found"})


class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

    # Get the tests for the exercise if exercise_id is given
    def get_queryset(self):
        queryset = Test.objects.all()
        exercise_id = self.request.query_params.get("exercise_id", None)
        if exercise_id:
            queryset = queryset.filter(exercise=exercise_id)
        return queryset


class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer

    def get_queryset(self):
        exercise_id = self.request.query_params.get("exercise_id")
        owner = self.request.user.id
        if exercise_id and owner:
            return self.queryset.filter(
                submission__exercise_id=exercise_id, submission__owner=owner
            )
        return super().get_queryset()
