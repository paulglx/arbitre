from django.contrib.auth.models import User, Group
from django.http import HttpResponse, JsonResponse
from rest_framework import permissions, serializers, viewsets, status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class LogoutView(APIView):

    def post(self, request):
        try:
            refreshToken = request.data["refresh_token"]
            token = RefreshToken(refreshToken)
            token.blacklist()

            return Response("Logout successful", status=status.HTTP_200_OK)
        except Exception as e:
            return Response("Logout error", status=status.HTTP_400_BAD_REQUEST)


class UserSerializer(serializers.HyperlinkedModelSerializer):

    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )

        return user

    class Meta:
        model = User
        fields = ['url','id', 'username', 'password']

class UserGroup(APIView):
    """
    Get the group(s) that an user belongs to.
    """



    """
    def post(self, request, *args, **kwargs):
        user = User.objects.get(username=request.data.get('username'))
        groups = user.groups.all().values()
        return JsonResponse({"groups":list(groups)})
    """

    http_method_names = ['get']

    def get(self, request, *args, **kwargs):
        return JsonResponse(list(self.request.user.groups.all().values()), safe=False)
    

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

