from django.urls import re_path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"submission", views.SubmissionViewSet)
router.register(r"test", views.TestViewSet)
router.register(r"testresult", views.TestResultViewSet, basename="testresults")
router.register(
    r"refresh-submission", views.RefreshSubmissionViewSet, basename="refresh"
)

urlpatterns = [
    # ex: /polls/
    # run tests
    # TODO remove this path once the react front is working
    # path('<int:submission_id>/results', views.results, name='results'),
    # exercises
    re_path("api/", include(router.urls))
]
