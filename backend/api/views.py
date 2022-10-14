from rest_framework import viewsets

from .serializers import *
from .models import *

class CourseViewSet(viewsets.ModelViewSet):
    """
    List all Courses (GET), or create a new Course (POST).
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class SessionViewSet(viewsets.ModelViewSet):
    """
    List all sessions (GET), or create a new session (POST).
    """
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    """
    List all exercises (GET), or create a new exercise (POST).
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer