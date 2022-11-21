from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import permissions, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .serializers import MinimalUserSerializer, UserSerializer


class LogoutView(APIView):
    # permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        refresh_token = self.request.data.get("refresh")
        token = RefreshToken(token=refresh_token)
        token.blacklist()
        return Response({"status": "OK, goodbye"})


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
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer


class TeachersViewSet(viewsets.ViewSet):
    """
    Get all teachers
    """

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def list(self, request):
        teachers = User.objects.filter(groups__id=2)
        serializer = MinimalUserSerializer(teachers, many=True)
        return Response(serializer.data)
