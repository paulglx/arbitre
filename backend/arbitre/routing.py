from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(
        r"ws/submission/(?P<exercise_id>\d+)/(?P<token>.+)$",
        consumers.SubmissionConsumer.as_asgi(),
    ),
]
