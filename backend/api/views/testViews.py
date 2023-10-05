from rest_framework import viewsets
from api.models import Submission, Test, TestResult
from api.serializers import TestSerializer


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
        ).update(status="pending")

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
