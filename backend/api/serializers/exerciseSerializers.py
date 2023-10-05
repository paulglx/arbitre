from rest_framework import serializers
from ..models import Exercise, Session
from .sessionSerializers import MinimalSessionSerializer


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
            "grade",
        ]


class MinimalExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["id", "title"]
        depth = 1
