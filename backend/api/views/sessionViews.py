from rest_framework import viewsets, permissions
from api.models import Session
from ..serializers import SessionSerializer


class SessionViewSet(viewsets.ModelViewSet):
    """
    Manage sessions.

    List all sessions (GET), or create a new session (POST).

    body : {
        course_id: 1,
        title: "Session 1",
        description: "This is the first session"
    }
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
