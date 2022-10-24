from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import permissions, serializers, viewsets
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class LogoutView(APIView):
    # permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        refresh_token = self.request.data.get("refresh")
        token = RefreshToken(token=refresh_token)
        token.blacklist()
        return Response({"status": "OK, goodbye"})


class UserSerializer(serializers.HyperlinkedModelSerializer):

    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
        )

        return user

    class Meta:
        model = User
        fields = ["url", "id", "username", "password"]


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
