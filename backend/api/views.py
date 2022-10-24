from rest_framework import viewsets, permissions

from .serializers import *
from .models import *


class CourseViewSet(viewsets.ModelViewSet):
    """
    Get courses that current user is student of
    """

    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        user = self.request.user
        print("User:", user)
        return Course.objects.filter(students__in=[user])


class SessionViewSet(viewsets.ModelViewSet):
    """
    List all sessions (GET), or create a new session (POST).
    """

    serializer_class = SessionSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

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
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    # Return exercises of session if course_id param passed. Else, return all sessions
    def get_queryset(self):
        session_id = self.request.query_params.get("session_id")
        if session_id:
            return Exercise.objects.filter(session_id=session_id)
        else:
            return Exercise.objects.all()
