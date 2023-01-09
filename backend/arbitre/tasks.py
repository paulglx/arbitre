from celery import shared_task
import json
import requests
import environ

# Reading .env file
env = environ.Env()
environ.Env.read_env()


@shared_task
def run_camisole(submission_id, test_id, file_content, lang) -> None:
    """
    Runs one test on a submission, and stores the result in the database.
    """

    base_url = "http://localhost:8000/runner/api"
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
    hostname = env("HOSTNAME")
    camisole_server_url = f"http://{hostname}:42920/run"
    source = file_content

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
    requests.post(testresult_post_url, data=after_data)


@shared_task
def run_all_pending_tests() -> None:
    """
    Runs all pending submissions in the database
    """

    base_url = "http://localhost:8000"
    test_results = json.loads(
        requests.get(f"{base_url}/runner/api/testresult/").content
    )
    pending_test_results = [
        test_result
        for test_result in test_results
        if test_result["status"] == "pending"
    ]

    print("[PERIODIC] Running all pending tests...")

    if len(pending_test_results) == 0:
        print("[PERIODIC] No pending tests to run.")
        return

    for test_result in pending_test_results:
        submission = json.loads(
            requests.get(
                f"{base_url}/runner/api/submission/{test_result['submission']['id']}/"
            ).content
        )
        exercise = json.loads(
            requests.get(f"{base_url}/api/exercise/{submission['exercise']}/").content
        )
        course = json.loads(
            requests.get(
                f"{base_url}/api/course/{exercise['session']['course']['id']}/?all=true"
            ).content
        )
        test = json.loads(
            requests.get(
                f"{base_url}/runner/api/test/{test_result['exercise_test']['id']}/"
            ).content
        )
        file_content = json.loads(
            requests.get(
                f"{base_url}/runner/api/submission-file?submission_id={submission['id']}"
            ).content
        )["content"]

        run_camisole.delay(
            submission["id"], test["id"], file_content, course["language"]
        )

    print(f"[PERIODIC] {len(pending_test_results)} pending tests have been restarted.")
