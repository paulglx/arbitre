from rest_framework import serializers
from typing import List, Dict
from django.core.exceptions import ImproperlyConfigured
from api.auth.views import get_teachers
from django.core.cache import cache


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


class RoleBasedSerializer(serializers.ModelSerializer):
    """
    Base serializer that defines which fields are available for each role.
    Override role_fields in child classes.
    """

    role_fields: Dict[str, List[str] | None] = {
        "teacher": None,  # None means all fields
        "student": [],  # Empty list means no fields
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not hasattr(self.Meta, "model"):
            raise ImproperlyConfigured(
                f"{self.__class__.__name__} must define Meta.model"
            )
        if not self.role_fields:
            raise ImproperlyConfigured(
                f"{self.__class__.__name__} must define role_fields"
            )

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")

        if not request or not request.user:
            return {}

        user_role = self.get_user_role(request.user)
        allowed_fields = self.role_fields.get(user_role, [])

        # If allowed_fields is None, return all fields
        if allowed_fields is None:
            return fields

        # Otherwise, filter fields based on the role
        return {
            field_name: field
            for field_name, field in fields.items()
            if field_name in allowed_fields
        }

    def get_user_role(self, user):
        """Determine user's role. Override this method if needed."""
        if user in get_cached_teachers():
            return "teacher"
        return "student"
