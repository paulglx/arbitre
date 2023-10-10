from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import MinimalUserSerializer, UserSerializer
import keycloak
import environ
import os

# Reading .env file
env = environ.Env()
environ.Env.read_env(
    env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
)

SERVER_URL = env("KEYCLOAK_URL", default="http://localhost:8080")
CLIENT_ID = env("OIDC_RP_CLIENT_ID", default="arbitre")
REALM_NAME = env("KEYCLOAK_REALM_NAME", default="master")
ADMIN_USERNAME = env("KEYCLOAK_ADMIN_USERNAME", default="admin")
ADMIN_PASSWORD = env("KEYCLOAK_ADMIN_PASSWORD", default="admin")


def admin_login():
    return keycloak.KeycloakAdmin(
        server_url=SERVER_URL,
        username=ADMIN_USERNAME,
        password=ADMIN_PASSWORD,
        realm_name=REALM_NAME,
        verify=True,
    )


def get_teachers():
    KEYCLOAK_ADMIN = admin_login()
    keycloak_teachers = KEYCLOAK_ADMIN.get_realm_role_members(role_name="teacher")
    emails = [teacher["email"] for teacher in keycloak_teachers]
    return User.objects.filter(email__in=emails)


class UserViewSet(viewsets.ModelViewSet):
    """
    GET and POST users.
    Used to create users (DEPRECATED since Keycloak).
    Only admin can create users (DEPRECATED since Keycloak).
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer


class TeachersViewSet(viewsets.ViewSet):
    def list(self, request):
        """
        GET all users with the teacher role.
        """

        # Check if teacher roles exists
        try:
            KEYCLOAK_ADMIN = admin_login()
            KEYCLOAK_ADMIN.get_realm_role(role_name="teacher")
        except keycloak.exceptions.KeycloakAuthenticationError:
            print("ERROR: Keycloak authentication failed")
        except keycloak.exceptions.KeycloakGetError:
            print("WARNING: teacher role does not exist. Creating it")
            KEYCLOAK_ADMIN.create_realm_role({"name": "teacher"})

        teachers = get_teachers()

        serializer = MinimalUserSerializer(teachers, many=True)
        return Response(serializer.data)
