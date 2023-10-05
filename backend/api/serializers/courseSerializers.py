from rest_framework import serializers
from ..models import Course
from .authSerializers import MinimalUserSerializer


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
