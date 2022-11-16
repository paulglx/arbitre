
from .models import Course, Session, Exercise
from .serializers import CourseSerializer, SessionSerializer, ExerciseSerializer, MinimalExerciseSerializer
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from runner.models import Submission
from runner.serializers import SubmissionSerializer


class CourseViewSet(viewsets.ModelViewSet):
    """
    List all courses of student, or courses created by teacher (GET)
    Create a new course (POST)
    """

    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    # Allow students or owner to get their courses
    def get_queryset(self):
        user = self.request.user
        return Course.objects.filter(Q(students__in=[user]) | Q(owner=user)).distinct()

    # Auto set owner to current user
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class SessionViewSet(viewsets.ModelViewSet):
    """
    List all sessions (GET), or create a new session (POST).
    """

    serializer_class = SessionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    # Return sessions of course if course_id param passed. Else, return all sessions
    def get_queryset(self):
        course_id = self.request.query_params.get("course_id")
        if course_id:
            return Session.objects.filter(course_id=course_id)
        else:
            return Session.objects.all()


class ExerciseViewSet(viewsets.ModelViewSet):
    """
    List all exercises (GET), or create a new exercise (POST).
    """

    serializer_class = ExerciseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    # Return exercises of session if course_id param passed. Else, return all sessions
    def get_queryset(self):
        session_id = self.request.query_params.get("session_id")
        if session_id:
            return Exercise.objects.filter(session_id=session_id)
        else:
            return Exercise.objects.all()

class ResultsViewSet(viewsets.ViewSet):
    """
    Get submission statuses for all exercises for given user.
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        user = User.objects.get(id=self.request.data["user_id"])
        exercises = Exercise.objects.filter(
            Q(session__course__students__in=[user]) | Q(session__course__owner=user)
        ).distinct()

        # Get all the exercises to do
        exercises_serializer = MinimalExerciseSerializer(exercises, many=True)
        exercises_to_do = [exercise["id"] for exercise in exercises_serializer.data]

        # Get status for exercises that have been submitted
        submissions = Submission.objects.filter(owner=user, exercise__in=exercises)
        submissions_serializer = SubmissionSerializer(submissions, many=True)
        
        # Return exercise and status only
        results = []
        for exercise in exercises_to_do:
            status = "not submitted"
            for submission in submissions_serializer.data:
                if submission["exercise"] == exercise:
                    status = submission["status"]
            results.append({"exercise": exercise, "status": status})

        return Response(results)

