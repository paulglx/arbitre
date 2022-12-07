from rest_framework import viewsets, permissions
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
                "status": "pending",
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

    # GET runner/api/refresh-submission?submission_id=...
    def list(self, request):
        try:
            # if all=true parameter passed, refresh all submissions

            if request.query_params.get("all") == "true":
                submissions = Submission.objects.all()
            else:
                submissions = Submission.objects.filter(
                    pk=request.query_params["submission_id"]
                )
            
            for submission in submissions:
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
                Submission.objects.filter(pk=submission.id).update(
                    status=status
                )
            
            return JsonResponse({"detail": "Submission status updated"})

        except Submission.DoesNotExist:
            return JsonResponse({"status": "Not Found"})


class SubmissionFileViewSet(viewsets.ViewSet):
    """
    Returns submission file
    """

    # GET runner/api/submission-file?submission_id=...
    def list(self, request):
        try:
            submission = Submission.objects.get(
                pk=request.query_params["submission_id"]
            )
            try:
                with submission.file.open(mode="rb") as f:
                    file_content = f.read().decode()
            except FileNotFoundError:
                return JsonResponse({"file": "Not Found", "content": ""})

            return JsonResponse({"file": str(submission.file), "content": file_content})
        except Submission.DoesNotExist:
            return JsonResponse({"file": "Not Found", "content": ""})


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
    permission_classes = [permissions.IsAuthenticated]

    # GET runner/api?exercise_id=...
    def get_queryset(self):
        exercise_id = self.request.query_params.get("exercise_id")

        if exercise_id:
            if self.request.query_params.get("user_id"):
                user_id = self.request.query_params.get("user_id")
            else:
                user_id = self.request.user.id

            return self.queryset.filter(
                submission__exercise_id=exercise_id, submission__owner=user_id
            )
        else:
            return super().get_queryset()
