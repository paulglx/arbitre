from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'submissions', views.SubmissionViewSet)
router.register(r'tests', views.TestViewSet)
router.register(r'testresults', views.TestResultViewSet, basename="testresults")

urlpatterns = [
    # ex: /polls/
    #run tests
    path('<int:submission_id>/results', views.results, name='results'),

    #exercises
    re_path('api/', include(router.urls))
]