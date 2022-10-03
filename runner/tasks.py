import requests
from celery import Celery, shared_task
import json

#app = Celery('arbitre', backend='redis://localhost:6379', broker='redis://localhost:6379')

"""

#@app.task
@shared_task
def run_camisole(submission):
    #Run tests on submission

    tests_to_run_list = Test.objects.filter(exercise = submission.exercise)

    print("## TESTS TO RUN :\n", tests_to_run_list.values())

    existing_result = TestResult.objects.filter(submission = submission, exercise_test = Test.objects.all()[0])

    test_result = TestResult(
            id = existing_result.first().id if existing_result else None,
            running = True,
    )

    filename = submission.file.path
    with open(filename, 'r') as f:
            source = f.read()

    lang = 'python' #TODO add language choices to Submission model

    #TODO get tests correctly
    test_objects = [dic["rules"] for dic in list(Test.objects.filter(exercise = submission.exercise).values('rules'))]

    print("[(tasks.py) TEST OBJECTS :]\n",test_objects)

    test_object = test_objects[0]

    url = "http://oasis:1234/run"
    data = {
        "lang":lang, 
        "source":source,
        "tests":test_object
    }
    response = requests.post(url, json=data)

    camisole_response = response.get()

    for test in camisole_response["tests"]:

        #TODO correctly get existing test result for submission and test

        expected_stdout = next(initial_test for initial_test in tests["tests"] if initial_test["name"] == test["name"])["stdout"]

        test_result = TestResult(
            id = existing_result.first().id if existing_result else None,
            submission = submission,
            exercise_test = Test.objects.all()[0],
            running=False,
            stdout = test["stdout"],
            success = test["stdout"] == expected_stdout,
            time = round(test["meta"]["wall-time"],2),
            memory = test["meta"]["cg-mem"]
        )
        test_result.save()

"""

#@app.task
@shared_task
def add(x,y):
    return x+y

@shared_task
def run_camisole(submission_id, test_id) -> None:
    """
    Runs one test on a submission, and stores the result in the database.
    """

    from runner.models import Test, Submission, TestResult

    test = Test.objects.get(pk=test_id)
    submission = Submission.objects.get(pk=submission_id)

    #Check if there is already a result for this (submission, test) pair
    existing_test_result = TestResult.objects.filter(submission=submission, exercise_test=test).first()

    #Save the empty test result with "running" status
    pre_test_result = TestResult(
        id = existing_test_result.id if existing_test_result else None,
        submission = submission,
        exercise_test = test,
        running = True,
    )
    pre_test_result.save()

    camisole_server_url = "http://oasis:1234/run"
    lang = 'python'
    filename = submission.file.path
    with open(filename, 'r') as f:
            source = f.read()

    response_object = requests.post(
        camisole_server_url,
        json={
            "lang":lang,
            "source":source,
            "tests":[{
                "name":test.name,
                "stdin": test.stdin
            }]
        }
    )

    response = json.loads(response_object.text)["tests"][0]
    #This is because of the response's format : {'success': True, 'tests': [{ ... }]}

    print("WHAT WE WANT:", test.stdout)
    print("WHAT WE GOT:",response["stdout"])

    #Save the complete test results into the database
    post_test_result = TestResult(
        id = pre_test_result.id,
        submission = submission,
        exercise_test = test,
        running=False,
        stdout = response["stdout"],
        success = response["stdout"] == test.stdout,
        time = response["meta"]["wall-time"],
        memory = response["meta"]["cg-mem"]
    )
    post_test_result.save()