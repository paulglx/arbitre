from api.auth.views import get_teachers
from django.core.cache import cache
from functools import cached_property
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_api_key.permissions import HasAPIKey


def get_cached_teachers():
    """
    Cache the teachers list for a configurable duration.
    """
    CACHE_KEY = "keycloak_teachers"
    CACHE_DURATION = 300  # 5mn default

    teachers = cache.get(CACHE_KEY)
    if teachers is None:
        teachers = list(get_teachers())  # Convert QuerySet to list for serialization
        cache.set(CACHE_KEY, teachers, CACHE_DURATION)
    return teachers


class RoleBasedViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet that handles role-based serialization and permissions
    """

    permission_classes = [HasAPIKey | IsAuthenticated]

    @cached_property
    def teachers(self):
        return get_cached_teachers()
