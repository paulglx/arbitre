from rest_framework import viewsets, permissions
from .models import Submission, Test, TestResult
from runner.serializers import (
    SubmissionSerializer,
    TestResultSerializer,
    TestSerializer,
)
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework_api_key.permissions import HasAPIKey
from django.utils import timezone
from rest_framework import serializers


class SubmissionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

    def perform_create(self, serializer):
        # Check if there's a hard deadline and if it's passed
        session = serializer.validated_data["exercise"].session
        if (
            session.deadline_type == "hard"
            and session.deadline is not None
            and session.deadline < timezone.now()
        ):
            raise serializers.ValidationError(
                {"detail": "Hard deadline passed, can't submit"}
            )

        # If there are no tests, set submission status to "success"
        tests = Test.objects.filter(exercise=self.request.data["exercise"])
        if len(tests) == 0:
            status = "success"
        else:
            status = "pending"

        # Create submission or update it if it already exists
        submission, created = Submission.objects.update_or_create(
            exercise_id=self.request.data["exercise"],
            owner=self.request.user,
            defaults={
                "file": self.request.data["file"],
                "status": status,
            },
        )
        submission.save()
        submission.refresh_status()

    # Get submission for  exercise if exercise_id is given
    def get_queryset(self):
        exercise_id = self.request.query_params.get("exercise_id", None)
        user_id = self.request.query_params.get("user_id", None)
        if user_id:
            user = User.objects.get(pk=user_id)
        else:
            user = self.request.user
        if exercise_id:
            queryset = Submission.objects.filter(exercise=exercise_id, owner=user)
        elif user_id:
            queryset = Submission.objects.filter(owner=user)
        else:
            queryset = Submission.objects.all()
        return queryset


class RefreshSubmissionViewSet(viewsets.ViewSet):
    """
    Refreshes submission status based on all test results statuses for that submission
    """

    permission_classes = [permissions.IsAuthenticated]

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
                Submission.objects.filter(pk=submission.id).update(status=status)

            return JsonResponse({"detail": "Submission status updated"})

        except Submission.DoesNotExist:
            return JsonResponse({"status": "Not Found"})


class SubmissionFileViewSet(viewsets.ViewSet):
    """
    Returns submission file with content
    """

    permission_classes = [permissions.IsAuthenticated]

    # GET runner/api/submission-file?submission_id=...
    def list(self, request):
        error_response = JsonResponse(
            {"file": "Not Found", "content": "", "language": "", "type": ""}
        )

        try:
            submission = Submission.objects.select_related(
                "exercise", "exercise__session", "exercise__session__course"
            ).get(pk=request.query_params["submission_id"])

            type = submission.exercise.type
            language = submission.exercise.session.course.language

            if (
                request.user != submission.owner
                and request.user not in submission.exercise.session.course.owners.all()
                and request.user not in submission.exercise.session.course.tutors.all()
            ):
                return error_response

            try:
                with submission.file.open(mode="rb") as f:
                    if type == "single":
                        file_content = f.read().decode()
                    elif type == "multiple":
                        # Get zip file, encode it in base64 and return it
                        import base64

                        file_content = base64.b64encode(f.read()).decode()
                    else:
                        return error_response

            except FileNotFoundError:
                return error_response

            return JsonResponse(
                {
                    "file": str(submission.file),
                    "content": file_content,
                    "language": language,
                    "type": type,
                }
            )

        except Submission.DoesNotExist:
            return error_response


class RequeueSubmissionsViewSet(viewsets.ViewSet):
    """
    Requeues all submissions for a given exercise
    """

    permission_classes = [permissions.IsAuthenticated]

    # GET runner/api/requeue-submissions?exercise_id=...
    def list(self, request):
        try:
            submissions = Submission.objects.filter(
                exercise_id=request.query_params["exercise_id"]
            )

            # Get all test results for the submissions and set their status to "pending"
            TestResult.objects.filter(
                submission__exercise_id=request.query_params["exercise_id"]
            ).update(status="pending", stdout="")

            # Set all submissions to pending
            for submission in submissions:
                Submission.objects.filter(pk=submission.id).update(status="pending")

            return JsonResponse({"detail": "Submissions requeued"})

        except Submission.DoesNotExist:
            return JsonResponse({"status": "Not Found"})


class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated | HasAPIKey]

    # Get the tests for the exercise if exercise_id is given
    def get_queryset(self):
        queryset = Test.objects.all()
        exercise_id = self.request.query_params.get("exercise_id", None)
        if exercise_id:
            queryset = queryset.filter(exercise=exercise_id)
        return queryset

    def perform_create(self, serializer):
        # Take all the submissions for this exercise and add a pending test with the new test
        test = serializer.save()

        for submission in Submission.objects.filter(
            exercise_id=self.request.data["exercise"]
        ):
            TestResult.objects.create(
                submission=submission,
                exercise_test=test,
                status="pending",
            )

        # Take all associated submissions and refresh their statuses
        for submission in Submission.objects.filter(
            exercise_id=self.request.data["exercise"]
        ):
            submission.refresh_status()

        return super().perform_create(serializer)

    def perform_update(self, serializer):
        # Take all test results for this exercise and this test and set their status to "pending"
        TestResult.objects.filter(
            submission__exercise_id=self.request.data["exercise"],
            exercise_test=self.request.data["id"],
        ).update(status="pending", stdout="")

        # Take all associated submissions and refresh their statuses
        for submission in Submission.objects.filter(
            exercise_id=self.request.data["exercise"]
        ):
            submission.refresh_status()

        serializer.save()
        return super().perform_update(serializer)

    def perform_destroy(self, instance):
        # Take all associated submissions and refresh their statuses
        exercise_id = instance.exercise.id
        for submission in Submission.objects.filter(exercise_id=exercise_id):
            submission.refresh_status()

        return super().perform_destroy(instance)


class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer

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
