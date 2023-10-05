from rest_framework import viewsets
from api.models import TestResult
from api.serializers import TestResultSerializer


class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer

    # GET runner/api?exercise_id=...
    def get_queryset(self):
        exercise_id = self.request.query_params.get("exercise_id")

        if exercise_id:
            if self.request.query_params.get("user_id"):
                user_id = self.request.query_params.get("user_id")
            else:
                user_id = self.request.user.id

            return self.queryset.filter(
                submission__exercise_id=exercise_id, submission__owner=user_id
            )
        else:
            return super().get_queryset()
