from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import permissions, viewsets
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .serializers import MinimalUserSerializer, UserSerializer


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(data={"message": "Invalid token"}, status=400)
        return Response(data={"message": "Successfully logged out"}, status=200)


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
    serializer_class = UserSerializer
    # TODO fix permissions
    permission_classes = [permissions.AllowAny]


class TeachersViewSet(viewsets.ViewSet):
    """
    Get all teachers
    """

    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        teachers = User.objects.filter(groups__id=2)
        serializer = MinimalUserSerializer(teachers, many=True)
        return Response(serializer.data)
