from django.contrib.auth.models import Group, User
from django.http import HttpResponse, JsonResponse
from django.views import View
from rest_framework import permissions, serializers, viewsets
from rest_framework.decorators import APIView


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

