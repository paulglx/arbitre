from rest_framework import serializers
from typing import List, Dict
from api.auth.views import get_teachers
from django.core.cache import cache
from rest_framework_api_key.permissions import KeyParser
from rest_framework_api_key.models import APIKey


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

        # Get user from context
        request = self.context.get("request")
        user_role = self.get_user_role(request)
        allowed_fields = self.role_fields.get(user_role, [])

        if allowed_fields is None:  # Teacher role gets all fields
            return fields

        return {
            field_name: field
            for field_name, field in fields.items()
            if field_name in allowed_fields
        }

    def get_user_role(self, request):
        """Determine user's role using cached teachers list."""

        if not request:
            # Happens when using WebSocket
            return "student"

        user = request.user

        if not user or not user.is_authenticated:
            if self.has_valid_api_key(request):
                return "teacher"
            else:
                return "student"

        if user in get_cached_teachers():
            return "teacher"
        return "student"

    def has_valid_api_key(self, request):
        """
        Parses the request for API Key and checks if it's valid
        """
        keyParser = KeyParser()
        key = keyParser.get_from_authorization(request)

        return key and APIKey.objects.is_valid(key)
