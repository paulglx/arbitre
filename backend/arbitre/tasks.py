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
    source = prefix + file_content + suffix

    # TODO make this configurable
    compile_limits = {
        "time": 10,
        "wall-time": 10,
        "extra-time": 0,
        "mem": 1_000_000,  # 1 GB
        "virt-mem": 100_000,  # 1 GB
        "fsize": 100_000,  # 100MB
        "processes": 10,
        "stack": 100_000,  # 100MB
    }

    execute_limits = {
        "time": 10,
        "wall-time": 10,
        "extra-time": 0,
        "mem": 1_000_000,  # 1 GB
        "virt-mem": 100_000,  # 1 GB
        "fsize": 100_000,  # 100MB
        "processes": 10,
        "stack": 100_000,  # 100MB
    }

    response_object = requests.post(
        camisole_server_url,
        json={
            "lang": lang,
            "source": source,
            "tests": [{"name": test["name"], "stdin": test["stdin"]}],
            "compile": compile_limits,
            "execute": execute_limits,
        },
    )

    response_text = json.loads(response_object.text)

    all_criteria = [
        "cgmem",
        "exitcode",
        "exitsig",
        "killed",
        "statuscode",
        "statusmessage",
        "time",
        "walltime",
    ]

    if "tests" in response_text:
        response = response_text["tests"][0]
        detail = ""
        # This is because of the response's format : {'success': True, 'tests': [{ ... }]}

        status = ""

        if response["exitcode"] == 0:
            if test["stdout"] == "" or response["stdout"] == test["stdout"]:
                criteria_to_check = []
                for criteria in all_criteria:
                    if test[criteria] != 0:
                        criteria_to_check.append(criteria)

                status = "success"

                for criteria in criteria_to_check:
                    match criteria:
                        case "cgmem":
                            if response["meta"]["cg-mem"] > test[criteria]:
                                status = "failed"
                                detail = f"Used too much memory ({test[criteria]})"
                        case "exitcode":
                            if response["exitcode"] != test[criteria]:
                                status = "failed"
                                detail = f"Wrong exit code ({test[criteria]})"
                        case "exitsig":
                            if response["exitsig"] != test[criteria]:
                                status = "failed"
                                detail = f"Wrong exit signal ({test[criteria]})"
                        case "killed":
                            if response["killed"] != test[criteria]:
                                status = "failed"
                                detail = "Was killed"
                        case "time":
                            if response["meta"]["time"] > test[criteria]:
                                status = "failed"
                                detail = f"Took too much time ({test[criteria]})"
                        case "walltime":
                            if response["meta"]["wall-time"] > test[criteria]:
                                status = "failed"
                                detail = f"Took too much wall-time ({test[criteria]})"
                        case _:
                            pass
            else:
                status = "failed"
        else:
            status = "error"

        # Save results to database using REST API
        after_data = {
            "submission_pk": submission_id,
            "exercise_test_pk": test_id,
            "stdout": f"{response['stdout']} {detail}\n {response['stderr']}",
            "status": status,
            "time": response["meta"]["walltime"],
            "memory": response["meta"]["cgmem"],
            "detail": detail,
        }
    else:
        after_data = {
            "submission_pk": submission_id,
            "exercise_test_pk": test_id,
            "stdout": "Error: no response from runner",
            "status": "error",
            "time": 0,
            "memory": 0,
            "detail": "",
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
