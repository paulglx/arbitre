from .authSerializers import MinimalUserSerializer
from rest_framework import serializers
from ..models import StudentGroup


class StudentGroupSerializer(serializers.ModelSerializer):
    students = MinimalUserSerializer(many=True, read_only=True)

    class Meta:
        model = StudentGroup
        fields = ["id", "name", "course", "students"]
