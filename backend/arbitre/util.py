from runner.models import Submission, TestResult
from runner.serializers import SubmissionSerializer, TestResultSerializer


def prepare_submission_message(submission_id):
    """
    Prepare the submission message to be sent to the frontend

    The data contains :
    {
        "type": "submission_update",
        "message": {
            "submission": <same content as the SubmissionSerializer>,
            "test_results": <list of test results, each containing the same content as the TestResultSerializer>
        }
    }
    """

    # Get the submission
    try:
        submission = Submission.objects.get(id=submission_id)
    except Submission.DoesNotExist:
        return None

    submission_serializer = SubmissionSerializer(submission)

    # Get the test results
    try:
        test_results = TestResult.objects.filter(submission=submission)
    except TestResult.DoesNotExist:
        test_results = []
    test_results_serializer = TestResultSerializer(test_results, many=True)

    return {
        "type": "submission_update",
        "message": {
            "submission": submission_serializer.data,
            "test_results": test_results_serializer.data,
        },
    }
