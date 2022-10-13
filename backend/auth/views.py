from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import permissions, serializers, viewsets, status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken


class LogoutView(APIView):
    #permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        ### Lets you log everyone out

        # if self.request.data.get('all'):
        #     token: OutstandingToken
        #     for token in OutstandingToken.objects.filter(user=request.user):
        #         _, _ = BlacklistedToken.objects.get_or_create(token=token)
        #     return Response({"status": "OK, goodbye, all refresh tokens blacklisted"})
        
        refresh_token = self.request.data.get('refresh')
        token = RefreshToken(token=refresh_token)
        token.blacklist()
        return Response({"status": "OK, goodbye"})


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

    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        user = User.objects.get(username=request.data.get('username'))
        groups = user.groups.all().values()
        return JsonResponse({"groups":list(groups)})
    

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

