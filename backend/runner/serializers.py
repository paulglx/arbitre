from .models import Submission, Test, TestResult
from rest_framework import serializers, validators
import copy
import requests


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ["id", "exercise", "name", "stdin", "stdout"]


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ["id", "exercise", "file", "status"]

    def run_validators(self, value):
        for validator in copy.copy(self.validators):
            if isinstance(validator, validators.UniqueTogetherValidator):
                self.validators.remove(validator)
        super(SubmissionSerializer, self).run_validators(value)


class TestResultSerializer(serializers.ModelSerializer):
    # Fixes depth=1 ignoring fields
    submission_pk = serializers.PrimaryKeyRelatedField(
        queryset=Submission.objects.all(), source="submission", write_only=True
    )
    exercise_test_pk = serializers.PrimaryKeyRelatedField(
        queryset=Test.objects.all(), source="exercise_test", write_only=True
    )
    stdout = serializers.CharField(trim_whitespace=False, required=False)

    class Meta:
        model = TestResult
        fields = (
            "id",
            "submission",
            "submission_pk",
            "exercise_test",
            "exercise_test_pk",
            "status",
            "stdout",
            "time",
            "memory",
        )
        depth = 1

    def run_validators(self, value):
        for validator in copy.copy(self.validators):
            if isinstance(validator, validators.UniqueTogetherValidator):
                self.validators.remove(validator)
        super(TestResultSerializer, self).run_validators(value)

    def create(self, request):
        testresult, created = TestResult.objects.get_or_create(
            submission=request["submission"],
            exercise_test=request["exercise_test"],
            defaults={
                "submission": request["submission"],
                "exercise_test": request["exercise_test"],
            },
        )

        testresult.status = request["status"]
        if testresult.status == "running":
            testresult.stdout = ""
            testresult.time = -1
            testresult.memory = -1
        else:
            testresult.stdout = request["stdout"]
            testresult.time = request["time"]
            testresult.memory = request["memory"]

        testresult.save()

        # Refresh submission status
        requests.get(
            f"http://localhost:8000/runner/api/"
            f"refresh-submission?submission_id={testresult.submission.id}"
        )

        return testresult
