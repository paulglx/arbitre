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
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

class ExerciseViewSet(viewsets.ModelViewSet):
    """
    List all exercises (GET), or create a new exercise (POST).
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)