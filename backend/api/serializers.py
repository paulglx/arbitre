from .models import Exercise, Session, Course, StudentGroup
from rest_framework import serializers
from api.auth.serializers import MinimalUserSerializer


class StudentGroupSerializer(serializers.ModelSerializer):
    students = MinimalUserSerializer(many=True, read_only=True)

    class Meta:
        model = StudentGroup
        fields = ["id", "name", "course", "students"]


class CourseSerializer(serializers.ModelSerializer):
    owners = MinimalUserSerializer(many=True, read_only=True)
    tutors = MinimalUserSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "auto_groups_enabled",
            "auto_groups_type",
            "description",
            "groups_enabled",
            "id",
            "join_code_enabled",
            "join_code",
            "language",
            "owners",
            "students",
            "title",
            "tutors",
        ]


class MinimalCourseSerializer(serializers.ModelSerializer):
    owners = MinimalUserSerializer(many=True, read_only=True)
    tutors = MinimalUserSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ["id", "title", "owners", "tutors", "language"]


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
        fields = [
            "id",
            "title",
            "description",
            "session_id",
            "session",
            "prefix",
            "suffix",
        ]


class MinimalExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["id", "title"]
        depth = 1
