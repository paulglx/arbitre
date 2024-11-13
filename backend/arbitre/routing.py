from django.urls import re_path

from . import consumers

# Expected url for TestResult websocket : `ws://localhost:8000/ws/submission/${exerciseId}?token=${keycloakToken}`
websocket_urlpatterns = [
    re_path(
        r"ws/submission/(?P<exercise_id>\d+)$",
        consumers.SubmissionConsumer.as_asgi(),
    ),
    re_path(
        r"ws/submission/(?P<exercise_id>\d+)/(?P<user_id>\d+)$",
        consumers.SubmissionConsumer.as_asgi(),
    )
]
