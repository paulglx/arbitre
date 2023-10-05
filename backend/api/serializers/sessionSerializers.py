from rest_framework import serializers
from ..models import Course, Session
from .courseSerializers import MinimalCourseSerializer


class SessionSerializer(serializers.ModelSerializer):
    course = MinimalCourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )

    class Meta:
        model = Session
        fields = ["id", "title", "description", "course", "course_id", "grade"]


class MinimalSessionSerializer(serializers.ModelSerializer):
    course = MinimalCourseSerializer()

    class Meta:
        model = Session
        fields = ["id", "title", "course"]
