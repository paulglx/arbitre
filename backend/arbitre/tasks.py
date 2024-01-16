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

def get_lang_id(lang):
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
    return JUDGE0_LANG_IDS[lang]

def get_base_url():
    if env("USE_HTTPS", default=True):
        base_url = "https://" + env("HOSTNAME") + "/runner/api"
    else:
        base_url = "http://" + env("HOSTNAME") + "/runner/api"
    return base_url

def post_running_testresult(submission_id, test_id, testresult_post_url):
    testresult_before_data = {
        "submission_pk": submission_id,
        "exercise_test_pk": test_id,
        "status": "running",
    }
    requests.post(testresult_post_url, data=testresult_before_data)

def send_test_to_judge0(judge0_url, source_code, language_id, stdin):
    response_object = requests.post(
        judge0_url,
        json={
            "language_id": language_id,
            "source_code": source_code,
            "stdin": stdin,
        },
    )
    return json.loads(response_object.text)

def post_error_testresult(submission_id, test_id, testresult_post_url):
    after_data = {
        "submission_pk": submission_id,
        "exercise_test_pk": test_id,
        "stdout": "Error: no response from runner",
        "status": "error",
        "time": 0,
        "memory": 0,
    }
    requests.post(testresult_post_url, data=after_data)

def process_source_single_file(file_content, prefix, suffix):
    # Fix prefix line endings
    if not prefix.endswith("\r") and not prefix.endswith("\n"):
        prefix += "\n"
    source_code = prefix + "\n" + file_content + "\n" + suffix

    return source_code

def process_source_multifile(file_content, teacher_files):
    # Unimplemented
    pass

@shared_task
def run_test(
    hostname, exercise_type, submission_id, test_id, file_content, prefix, suffix, lang
) -> None:
    """
    Runs one test on a submission, and stores the result in the database.
    """

    # Arbitre API urls
    base_url = get_base_url()
    testresult_post_url = f"{base_url}/testresult/"

    # Get test data from REST API
    test_data = requests.get(f"{base_url}/test/{test_id}/").content
    test = json.loads(test_data)

    # Save the empty test result with "running" status
    post_running_testresult(submission_id, test_id, testresult_post_url)

    judge0_url = f"http://{hostname}/submissions?wait=true"

    if exercise_type == "single":
        source_code = process_source_single_file(file_content, prefix, suffix)
    elif exercise_type == "multiple":
        #teacher_files = json.loads(requests.get(f"{base_url}/exercise/{test['exercise']}/").content)["teacher_files"]
        teacher_files = ""
        source_code = process_source_multifile(file_content, teacher_files)
    else:
        raise Exception("Invalid exercise type")

    language_id = get_lang_id(lang)

    try:
        response = send_test_to_judge0(judge0_url, source_code, language_id, test["stdin"])
    except requests.exceptions.ConnectionError:
        post_error_testresult(submission_id, test_id, testresult_post_url)
        return
    
    print("Judge0 response:" + str(response))

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

        stdout = ""
        if response["message"] is not None:
            stdout += response["message"]
        if response["stdout"] is not None:
            stdout += response["stdout"]
        if response["stderr"] is not None:
            stdout += response["stderr"]

        # Save results to database using REST API
        after_data = {
            "submission_pk": submission_id,
            "exercise_test_pk": test_id,
            "stdout": stdout,
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


@shared_task(ignore_result=True)
def run_all_pending_testresults() -> None:
    from runner.models import TestResult

    """
    Runs all pending submissions in the database
    """

    TestResult.run_all_pending_testresults()
