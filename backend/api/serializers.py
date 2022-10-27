from importlib.resources import read_binary
from .models import Exercise, Session, Course
from rest_framework import serializers


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "title", "description", "students"]


class MinimalCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "title"]


class SessionSerializer(serializers.ModelSerializer):
    course = MinimalCourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )

    class Meta:
        model = Session
        fields = ["id", "title", "description", "course", "course_id"]


class MinimalSessionSerializer(serializers.ModelSerializer):
    course = MinimalCourseSerializer()

    class Meta:
        model = Session
        fields = ["id", "title", "course_id"]


class ExerciseSerializer(serializers.ModelSerializer):
    session = MinimalSessionSerializer()

    class Meta:
        model = Exercise
        fields = "__all__"
