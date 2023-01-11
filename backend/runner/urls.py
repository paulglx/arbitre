from django.urls import re_path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"submission", views.SubmissionViewSet)
router.register(r"test", views.TestViewSet)
router.register(r"testresult", views.TestResultViewSet, basename="testresult")
router.register(
    r"refresh-submission", views.RefreshSubmissionViewSet, basename="refresh"
)
router.register(
    r"submission-file", views.SubmissionFileViewSet, basename="submission-file"
)

urlpatterns = [re_path("api/", include(router.urls))]
