from itertools import tee
from re import T
from .models import Exercise, Submission, Test, TestResult
from rest_framework import serializers

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['title, statement']

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['exercise','file','owner']

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['exercise','rules']

class TestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['file', 'exercise_test', 'success', 'time', 'memory']