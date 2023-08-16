from api.models import Course, Session, Exercise
from runner.models import Submission, TestResult, Test
import random

# ID of the course you want to fill
COURSE_ID = 86

# Get the course
course = Course.objects.get(id=COURSE_ID)

# Get all course students
students = course.students.all()


def generate_result():
    """
    Generate random test result status.
    Odds :
    - 85 % : success
    - 10 % : failed
    - 5 % : error
    """
    status = random.choices(["success", "failed", "error"], [85, 10, 5])[0]
    if status == "pass":
        return None
    else:
        return status


def run():
    for student in students:
        sessions = Session.objects.filter(course=course)
        for session in sessions:
            exercises = Exercise.objects.filter(session=session)
            for exercise in exercises:
                # Delete previous submission if it exists
                old_submission = Submission.objects.filter(
                    exercise=exercise, owner=student
                ).first()
                if old_submission:
                    old_submission.delete()

                # If no tests : skip
                tests = Test.objects.filter(exercise=exercise)
                if not tests:
                    continue

                # Roll a dice to decide if we ignore this submission
                if random.choices([True, False], [5, 95])[0]:
                    continue

                # Create dummy submission
                submission = Submission(
                    exercise=exercise,
                    owner=student,
                    ignore=True,
                )
                submission.save()

                # Create dummy test results for this submission
                for test in tests:
                    test_result = TestResult(
                        submission=submission,
                        exercise_test=test,
                        time=0.1,
                        memory=1,
                        status=generate_result(),
                        stdout="i'm dummy :)",
                    )
                    test_result.save()

                # Update submission status
                submission.refresh_status()
