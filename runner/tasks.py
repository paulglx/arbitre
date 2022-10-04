import requests
from celery import shared_task
from django.urls import reverse
import json


@shared_task
def run_camisole(submission_id, test_id) -> None:
    """
    Runs one test on a submission, and stores the result in the database.
    """

    from runner.models import Test, Submission, TestResult

    test = Test.objects.get(pk=test_id)
    submission = Submission.objects.get(pk=submission_id)

    # Check if there is already a result for this (submission, test) pair
    existing_test_result = TestResult.objects.filter(
        submission=submission, exercise_test=test
    ).first()

    # Save the empty test result with "running" status
    pre_test_result = TestResult(
        id=existing_test_result.id if existing_test_result else None,
        submission=submission,
        exercise_test=test,
        running=True,
    )
    pre_test_result.save()

    # Configure the data used to run camisole
    camisole_server_url = "http://oasis:1234/run"
    lang = "python"  # TODO add language choices
    filename = submission.file.path
    with open(filename, "r") as f:
        source = f.read()

    response_object = requests.post(
        camisole_server_url,
        json={
            "lang": lang,
            "source": source,
            "tests": [{"name": test.name, "stdin": test.stdin}],
        },
    )

    response = json.loads(response_object.text)["tests"][0]
    # This is because of the response's format : {'success': True, 'tests': [{ ... }]}

    # Save results to database using REST API
    post_data = {
        "id": pre_test_result.id,
        "submission": submission,
        "exercise_test": test,
        "running": False,
        "stdout": response["stdout"],
        "success": response["stdout"] == test.stdout,
        "time": response["meta"]["wall-time"],
        "memory": response["meta"]["cg-mem"],
    }
    # POST
    url = reverse("testresults")
    r = requests.post(url, data=post_data)