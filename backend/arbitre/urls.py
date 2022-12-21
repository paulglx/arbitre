"""arbitre URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from api.auth.views import LogoutView, UserGroup, UserViewSet, TeachersViewSet
from api.views import (
    AllResultsOfSessionViewSet,
    AllResultsViewSet,
    CourseJoinCodeEnabledViewSet,
    CourseJoinViewSet,
    CourseOwnerViewSet,
    CourseRefreshCodeViewSet,
    CoursesSessionsExercisesViewSet,
    CourseStudentViewSet,
    CourseTutorViewSet,
    CourseViewSet,
    ExerciseViewSet,
    ResultsOfSessionViewSet,
    SessionViewSet,
)
from django.contrib import admin
from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import routers, permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="Arbitre API",
        default_version="0.1.0",
        description="Arbitre is an automated exercises correction platform.",
        contact=openapi.Contact(email="paul.guilloux@telecom-sudparis.eu"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],  # TODO allow admins only in prod
)

# Auth router
auth_router = routers.DefaultRouter()
auth_router.register(r"users", UserViewSet, basename="users")
auth_router.register(r"teachers", TeachersViewSet, basename="teachers")

# Models API router
router = routers.DefaultRouter()
router.register(r"course_join", CourseJoinViewSet, basename="course_join")
router.register(r"course_owner", CourseOwnerViewSet, basename="course_owner")
router.register(
    r"course_refresh_code", CourseRefreshCodeViewSet, basename="course_refresh_code"
)
router.register(
    r"course_join_code_enabled",
    CourseJoinCodeEnabledViewSet,
    basename="course_join_code_enabled",
)
router.register(r"course_student", CourseStudentViewSet, basename="course_student")
router.register(r"course_tutor", CourseTutorViewSet, basename="course_tutor")
router.register(r"course", CourseViewSet, basename="course")
router.register(r"exercise", ExerciseViewSet, basename="exercise")
router.register(r"session", SessionViewSet, basename="session")

router.register(
    r"courses_sessions_exercises",
    CoursesSessionsExercisesViewSet,
    basename="courses_sessions_exercises",
)

router.register(r"results", ResultsOfSessionViewSet, basename="results")
router.register(
    r"session_results", AllResultsOfSessionViewSet, basename="session_results"
)
router.register(r"all_results", AllResultsViewSet, basename="all_results")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),  # Contains : /exercise, /session, /course
    path("api/auth/", include(auth_router.urls)),  # Contains : /users
    path("api/auth/logout/", LogoutView.as_view(), name="logout"),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/users/groups", UserGroup.as_view(), name="user_groups"),
    path("runner/", include("runner.urls")),
    # Swagger
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
]
