from .models import Exercise, Submission, Test, TestResult
from rest_framework import serializers


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["title", "statement"]


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ["exercise", "file", "owner"]


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ["exercise", "name", "stdin", "stdout"]


class TestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = ["submission", "exercise_test", "running", "stdout", "success", "time", "memory"]
