from rest_framework import viewsets, permissions

from .serializers import *
from .models import *

class CourseViewSet(viewsets.ModelViewSet):
    """
    List all Courses (GET), or create a new Course (POST).
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

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

#TODO write a view that gets the courses a user is registered to
"""
class CoursesOfUser(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        user = self.request.user
        print("User:", user)
        return Course.objects.filter()
"""