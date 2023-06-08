from celery import shared_task
import json
import requests
import environ

# Reading .env file
env = environ.Env()
environ.Env.read_env()


@shared_task
def run_camisole(submission_id, test_id, file_content, prefix, suffix, lang) -> None:
    """
    Runs one test on a submission, and stores the result in the database.
    """

    if env("USE_HTTPS", default=True):
        base_url = "https://" + env("HOSTNAME") + "/runner/api"
    else:
        base_url = "http://" + env("HOSTNAME") + "/runner/api"
    testresult_post_url = f"{base_url}/testresult/"

    test = json.loads(requests.get(f"{base_url}/test/{test_id}/").content)

    # Save the empty test result with "running" status
    testresult_before_data = {
        "submission_pk": submission_id,
        "exercise_test_pk": test_id,
        "status": "running",
    }
    requests.post(testresult_post_url, data=testresult_before_data)

    # Configure the data used to run camisole
    hostname = env("CAMISOLE_HOSTNAME", default="localhost")
    camisole_server_url = f"http://{hostname}:42920/run"

    # Fix prefix line endings
    if not prefix.endswith("\r") and not prefix.endswith("\n"):
        prefix += "\n"
    source = prefix + "\n" + file_content + "\n" + suffix

    print("SOURCE: ", source)

    response_object = requests.post(
        camisole_server_url,
        json={
            "lang": lang,
            "source": source,
            "tests": [{"name": test["name"], "stdin": test["stdin"]}],
        },
    )

    response_text = json.loads(response_object.text)

    if "tests" in response_text:
        response = response_text["tests"][0]
        # This is because of the response's format : {'success': True, 'tests': [{ ... }]}

        status = ""
        if response["exitcode"] == 0:
            if test["stdout"] == "":  # nothing to test for
                status = "success"
            if response["stdout"] == test["stdout"]:
                status = "success"
            else:
                status = "failed"
        else:
            status = "error"

        # Save results to database using REST API
        after_data = {
            "submission_pk": submission_id,
            "exercise_test_pk": test_id,
            "stdout": response["stdout"] + "\n" + response["stderr"],
            "status": status,
            "time": response["meta"]["wall-time"],
            "memory": response["meta"]["cg-mem"],
        }
    else:
        after_data = {
            "submission_pk": submission_id,
            "exercise_test_pk": test_id,
            "stdout": "Error: no response from runner",
            "status": "error",
            "time": 0,
            "memory": 0,
        }

    print("data to send:" + str(after_data))
    finalpost = requests.post(testresult_post_url, data=after_data)
    print("final post:", finalpost)


@shared_task(ignore_result=True)
def run_all_pending_testresults() -> None:

    from runner.models import TestResult

    """
    Runs all pending submissions in the database
    """

    print("[PERIODIC] Running all pending tests")
    TestResult.run_all_pending_testresults()
