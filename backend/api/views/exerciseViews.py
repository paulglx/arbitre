from rest_framework import viewsets, permissions
from api.models import Exercise
from ..serializers import ExerciseSerializer


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
