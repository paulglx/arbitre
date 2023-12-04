from .models import Exercise, Session, Course, StudentGroup
from runner.models import Submission
from rest_framework import serializers
from api.auth.serializers import MinimalUserSerializer
from django.utils import timezone


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
            "late_penalty",
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

    has_started = serializers.SerializerMethodField()
    has_ended = serializers.SerializerMethodField()

    def get_has_started(self, obj):
        return obj.start_date is None or obj.start_date < timezone.now()

    def get_has_ended(self, obj):
        return obj.deadline is not None and obj.deadline < timezone.now()

    class Meta:
        model = Session
        fields = [
            "id",
            "course_id",
            "course",
            "deadline_type",
            "deadline",
            "description",
            "grade",
            "has_started",
            "has_ended",
            "start_date",
            "title",
        ]


class MinimalSessionSerializer(serializers.ModelSerializer):
    course = MinimalCourseSerializer()

    has_ended = serializers.SerializerMethodField()
    can_submit = serializers.SerializerMethodField()

    def get_has_ended(self, obj):
        return SessionSerializer(obj).get_has_ended(obj)

    def get_can_submit(self, obj):
        return (
            obj.deadline_type == "soft"
            or obj.deadline is None
            or obj.deadline > timezone.now()
        )

    class Meta:
        model = Session
        fields = ["id", "title", "course", "can_submit", "has_ended", "deadline"]


class ExerciseSerializer(serializers.ModelSerializer):
    session = MinimalSessionSerializer(read_only=True)
    session_id = serializers.PrimaryKeyRelatedField(
        queryset=Session.objects.all(), source="session", write_only=True
    )

    # get submission status for current user (if any)
    submission_status = serializers.SerializerMethodField()

    def get_submission_status(self, obj):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            if user.is_authenticated:
                try:
                    submission = Submission.objects.get(exercise=obj, owner=user)
                    return submission.status
                except Submission.DoesNotExist:
                    return None
        return None

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
            "submission_status",
        ]


class MinimalExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["id", "title"]
        depth = 1
