from rest_framework import viewsets
from api.models import Submission, Test, TestResult
from api.serializers import SubmissionSerializer
from django.contrib.auth.models import User
from django.http import JsonResponse


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

    def perform_create(self, serializer):
        tests = Test.objects.filter(exercise=self.request.data["exercise"])
        if len(tests) == 0:
            status = "success"
        else:
            status = "pending"

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

    # GET runner/api/submission-file?submission_id=...
    def list(self, request):
        error_response = JsonResponse(
            {"file": "Not Found", "content": "", "language": ""}
        )

        try:
            submission = Submission.objects.get(
                pk=request.query_params["submission_id"]
            )

            language = submission.exercise.session.course.language

            if (
                request.user != submission.owner
                and request.user not in submission.exercise.session.course.owners.all()
                and request.user not in submission.exercise.session.course.tutors.all()
            ):
                return error_response

            try:
                with submission.file.open(mode="rb") as f:
                    file_content = f.read().decode()
            except FileNotFoundError:
                return error_response

            return JsonResponse(
                {
                    "file": str(submission.file),
                    "content": file_content,
                    "language": language,
                }
            )

        except Submission.DoesNotExist:
            return error_response
