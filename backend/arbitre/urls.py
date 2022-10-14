"""arbitre URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from email.mime import base
from django.contrib import admin
from django.urls import path, include
from api.auth.views import UserViewSet, UserGroup, LogoutView
from api.views import ExerciseViewSet, SessionViewSet, CourseViewSet

from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

#Auth router
auth_router = routers.DefaultRouter()
auth_router.register(r'users', UserViewSet)

#Models API router
router = routers.DefaultRouter()
router.register(r'exercise', ExerciseViewSet)
router.register(r'session', SessionViewSet)
router.register(r'course', CourseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('runner/', include('runner.urls')),
    path('api/', include(router.urls)), #Contains : /exercise, /session, /course
    path('api/auth/', include(auth_router.urls)), #Contains : /users
    path('api/auth/users/groups', UserGroup.as_view(), name='user_groups'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
