from celery import shared_task
import json
import requests


@shared_task
def run_camisole(submission_id, test_id, file_content) -> None:
    """
    Runs one test on a submission, and stores the result in the database.
    """

    base_url = "http://localhost:8000/runner/api"
    post_url = f"{base_url}/testresult/"

    test = json.loads(requests.get(f"{base_url}/test/{test_id}/").content)

    # Save the empty test result with "running" status
    before_data = {
        "submission_pk": submission_id,
        "exercise_test_pk": test_id,
        "running": True,
    }
    requests.post(post_url, data=before_data)

    # Configure the data used to run camisole
    camisole_server_url = "http://oasis:1234/run"
    lang = "python"  # TODO add language choices:
    source = file_content

    response_object = requests.post(
        camisole_server_url,
        json={
            "lang": lang,
            "source": source,
            "tests": [{"name": test["name"], "stdin": test["stdin"]}],
        },
    )

    response = json.loads(response_object.text)["tests"][0]

    # This is because of the response's format : {'success': True, 'tests': [{ ... }]}

    # Save results to database using REST API

    after_data = {
        "submission_pk": submission_id,
        "exercise_test_pk": test_id,
        "running": False,
        "stdout": response["stdout"] + "\n" + response["stderr"],
        "success": response["stdout"] == test["stdout"] and response["exitcode"] == 0,
        "time": response["meta"]["wall-time"],
        "memory": response["meta"]["cg-mem"],
    }
    print("data to send:" + str(after_data))
    requests.post(post_url, data=after_data)
