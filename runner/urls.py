from django.urls import path

from . import views

urlpatterns = [
    # ex: /polls/
    path('<int:file_id>/run', views.run, name='run'),
]