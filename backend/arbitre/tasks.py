from celery import shared_task
import json
import requests
import environ
import os
import sys

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
        base_url = "https://" + env("HOSTNAME")
    else:
        base_url = "http://" + env("HOSTNAME")
    return base_url


def get_base_api_url():
    return get_base_url() + "/api"


def get_base_runner_url():
    return get_base_url() + "/runner/api"


def get_api_key():
    api_key = env("API_KEY", default="")
    if api_key == "":
        raise Exception("API_KEY is not set. The runners can't access the REST API.")
    return api_key


def post_running_testresult(submission_id, test_id, testresult_post_url):
    testresult_before_data = {
        "submission_pk": submission_id,
        "exercise_test_pk": test_id,
        "status": "running",
    }
    requests.post(testresult_post_url, data=testresult_before_data)


def send_test_to_judge0(judge0_url, source_code, additional_files, language_id, stdin):

    request = {
        "language_id": language_id,
        "source_code": source_code,
        "stdin": stdin,
    }

    if additional_files:
        request["additional_files"] = additional_files

    response_object = requests.post(judge0_url, json=request)
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


def zip_directory(path, zip_file_handle):

    for root, _dirs, files in os.walk(path):
        for file in files:
            zip_file_handle.write(
                os.path.join(root, file), os.path.basename(os.path.join(root, file))
            )

    print(f"Directory {path} zipped successfully")


def process_source_single_file(file_content, prefix, suffix):
    # Fix prefix line endings
    if not prefix.endswith("\r") and not prefix.endswith("\n"):
        prefix += "\n"
    source_code = prefix + "\n" + file_content + "\n" + suffix

    return source_code


def process_source_multifile(student_files, exercise_id):

    # student_files is the base64-encoded zip file containing the student's files
    import base64
    import tempfile
    import zipfile
    import os

    teacher_files_request = requests.get(
        f"{get_base_api_url()}/exercise_teacher_files?exercise_id={exercise_id}",
        headers={"Authorization": f"Api-Key {get_api_key()}"},
    )

    # Handle 401 error
    if teacher_files_request.status_code == 401:
        print(
            "ERROR while trying to get teacher files content : Unauthorized access to the REST API",
            file=sys.stderr,
        )
        return

    teacher_files = teacher_files_request.content.decode().replace('"', "")

    student_files_data = base64.b64decode(student_files)
    teacher_files_data = base64.b64decode(teacher_files)

    student_files_zip = tempfile.NamedTemporaryFile()
    teacher_files_zip = tempfile.NamedTemporaryFile()

    with open(student_files_zip.name, "wb") as f:
        f.write(student_files_data)

    with open(teacher_files_zip.name, "wb") as f:
        f.write(teacher_files_data)

    with tempfile.TemporaryDirectory() as tmp:

        # Extract zips in temp folder
        zipfile.ZipFile(teacher_files_zip).extractall(tmp)
        zipfile.ZipFile(student_files_zip).extractall(tmp)

        print("ls : " + str(os.listdir(tmp)))

        # Create final zip file
        final = tempfile.NamedTemporaryFile()

        # Zip whole tmp directory
        with zipfile.ZipFile(final.name, mode="w") as final_zip:
            zip_directory(tmp, final_zip)
            print("I am now done zipping. This is my content")
            print(final_zip.namelist())

        # Convert zip to b64
        final_b64 = base64.b64encode(final.read())
        final_b64_str = final_b64.decode().replace('"', "")

        final.close()

    student_files_zip.close()
    teacher_files_zip.close()

    return final_b64_str


@shared_task
def run_test(
    hostname, exercise_type, submission_id, test_id, file_content, prefix, suffix, lang
) -> None:
    """
    Runs one test on a submission, and stores the result in the database.
    """

    # Arbitre API base URL
    base_url = get_base_runner_url()
    testresult_post_url = f"{base_url}/testresult/"

    try:
        # API key
        api_key = get_api_key()

        # Get test data from REST API
        test_data = requests.get(f"{base_url}/test/{test_id}/").content
        test = json.loads(test_data)

        # Save the empty test result with "running" status
        post_running_testresult(submission_id, test_id, testresult_post_url)

        judge0_url = f"http://{hostname}/submissions?wait=true"

        if exercise_type == "single":
            language_id = get_lang_id(lang)
            source_code = process_source_single_file(file_content, prefix, suffix)
            additional_files = ""
        elif exercise_type == "multiple":
            language_id = 89
            source_code = ""
            additional_files = process_source_multifile(file_content, test["exercise"])
        else:
            raise Exception("Invalid exercise type")

        try:
            response = send_test_to_judge0(
                judge0_url, source_code, additional_files, language_id, test["stdin"]
            )
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
            for key in ["message", "stdout", "stderr", "compile_output"]:
                if response[key] is not None:
                    stdout += response[key]

            time = response.get("time", 0)
            time = time if time is not None else 0

            memory = response.get("memory", 0)
            memory = memory if memory is not None else 0

            # Save results to database using REST API
            after_data = {
                "submission_pk": submission_id,
                "exercise_test_pk": test_id,
                "stdout": stdout,
                "status": status,
                "time": time,
                "memory": memory,
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

    except Exception as e:
        print("Exception: " + str(e))
        after_data = {
            "submission_pk": submission_id,
            "exercise_test_pk": test_id,
            "stdout": "An error occured while running the test. Please contact the administrator.",
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
