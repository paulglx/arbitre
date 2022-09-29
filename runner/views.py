from django.template import loader
from django.http import HttpResponse
from rest_framework import generics

from runner.serializers import ExerciseSerializer
from .models import Submission, Exercise
import requests
import json

class exercise_list(generics.ListCreateAPIView):
    """
    List all exercises (GET), or create a new exercise (POST).
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

# Create your views here.
def run(request, file_id):
    template = loader.get_template('runner/index.html')

    page_context:dict = {}

    url = "http://oasis:1234/run"
    submission = Submission.objects.get(pk=file_id)
    filename = submission.file.path
    owner = submission.owner
    exercise = Submission.objects.get(pk=file_id).exercise
    tests_object = json.loads(exercise.tests)

    data = {}
    data['lang'] = 'python'
    data.update(tests_object)
    with open(filename, 'r') as f:
        data['source'] = f.read()

    r = requests.post(url, json=data)
    camisole_response = json.loads(r.text)

    test_results = []

    for test in camisole_response["tests"]:

        expected_stdout = next(initial_test for initial_test in tests_object["tests"] if initial_test["name"] == test["name"])["stdout"]
        test_results.append({
            "name":test["name"],
            "stdout" : test["stdout"],
            "success" : test["stdout"] == expected_stdout,
            "time": round(test["meta"]["wall-time"],2)
            })

    page_context["filename"] = filename.split("/")[-1]
    page_context["exercise"] = exercise.title
    page_context["statement"] = exercise.statement
    page_context["owner"] = owner
    page_context["test_results"] = test_results

    return HttpResponse(template.render(page_context, request))
