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
        fields = ["id", "title", "course"]


class ExerciseSerializer(serializers.ModelSerializer):
    session = MinimalSessionSerializer(read_only=True)
    session_id = serializers.PrimaryKeyRelatedField(
        queryset=Session.objects.all(), source="session", write_only=True
    )

    class Meta:
        model = Exercise
        fields = ["id", "title", "description", "session_id", "session"]


class MinimalExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["id", "title"]
        depth = 1
