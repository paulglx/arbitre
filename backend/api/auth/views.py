from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import permissions, viewsets
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .serializers import MinimalUserSerializer, UserSerializer


class UserGroup(APIView):
    """
    Get the group(s) that an user belongs to.
    """

    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        user = User.objects.get(username=request.data.get("username"))
        groups = user.groups.all().values()
        return JsonResponse({"groups": list(groups)})


class UserViewSet(viewsets.ModelViewSet):
    """
    GET and POST users.
    Used to create users (DEPRECATED since Keycloak).
    Only admin can create users (DEPRECATED since Keycloak).
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer


class TeachersViewSet(viewsets.ViewSet):
    """
    GET all users in "Teachers" group.
    """

    def list(self, request):
        teachers = User.objects.filter(groups__id=2)
        serializer = MinimalUserSerializer(teachers, many=True)
        return Response(serializer.data)
