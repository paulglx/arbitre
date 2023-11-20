from celery import shared_task
import json
import requests
import environ
import os

# Reading .env file
env = environ.Env()
environ.Env.read_env(
    env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
)


@shared_task
def run_test(
    hostname, submission_id, test_id, file_content, prefix, suffix, lang
) -> None:
    """
    Runs one test on a submission, and stores the result in the database.
    """

    JUDGE0_LANG_IDS = {
        "asm": 45,
        "bash": 46,
        "basic": 47,
        "c": 50,
        "clojure": 86,
        "cobol": 77,
        "commonlisp": 55,
        "cpp": 54,
        "csharp": 51,
        "d": 56,
        "elixir": 57,
        "erlang": 58,
        "executable": 44,
        "fsharp": 87,
        "fortran": 59,
        "go": 60,
        "groovy": 88,
        "haskell": 61,
        "java": 62,
        "javascript": 63,
        "kotlin": 78,
        "lua": 64,
        "objective-c": 79,
        "ocaml": 65,
        "octave": 66,
        "pascal": 67,
        "perl": 85,
        "php": 68,
        "python": 71,
        "r": 80,
        "ruby": 72,
        "rust": 73,
        "scala": 81,
        "sql": 82,
        "swift": 83,
        "typescript": 74,
        "vbnet": 84,
    }

    # Arbitre API urls
    if env("USE_HTTPS", default=True):
        base_url = "https://" + env("HOSTNAME") + "/runner/api"
    else:
        base_url = "http://" + env("HOSTNAME") + "/runner/api"
    testresult_post_url = f"{base_url}/testresult/"

    # Get test data from REST API
    test = json.loads(requests.get(f"{base_url}/test/{test_id}/").content)

    # Save the empty test result with "running" status
    testresult_before_data = {
        "submission_pk": submission_id,
        "exercise_test_pk": test_id,
        "status": "running",
    }
    requests.post(testresult_post_url, data=testresult_before_data)

    judge0_url = f"http://{hostname}/submissions?wait=true"

    # Fix prefix line endings
    if not prefix.endswith("\r") and not prefix.endswith("\n"):
        prefix += "\n"
    source_code = prefix + "\n" + file_content + "\n" + suffix

    language_id = JUDGE0_LANG_IDS[lang]

    try:
        response_object = requests.post(
            judge0_url,
            json={
                "language_id": language_id,
                "source_code": source_code,
                "stdin": test["stdin"],
            },
        )
    except requests.exceptions.ConnectionError:
        after_data = {
            "submission_pk": submission_id,
            "exercise_test_pk": test_id,
            "stdout": "Error: the code runner seems to be offline",
            "status": "error",
            "time": 0,
            "memory": 0,
        }
        print("data to send:" + str(after_data))
        finalpost = requests.post(testresult_post_url, data=after_data)
        return

    response = json.loads(response_object.text)

    print("response:", response)

    if "stdout" or "stderr" in response:
        status = ""
        if response["stdout"]:
            if test["stdout"] == "":  # nothing to test for
                status = "success"
            if response["stdout"] == test["stdout"]:
                status = "success"
            else:
                status = "failed"
        else:
            status = "error"

        print("status:", status)
        print("stdout", response["stdout"])
        print("stderr", response["stderr"])

        # Save results to database using REST API
        after_data = {
            "submission_pk": submission_id,
            "exercise_test_pk": test_id,
            "stdout": response["stdout"] or response["stderr"] or "",
            "status": status,
            "time": response["time"],
            "memory": response["memory"],
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

    TestResult.run_all_pending_testresults()
