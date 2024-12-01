from api.models import Course, Session, Exercise
from runner.models import Submission, TestResult, Test
import random

"""
Fill a course with dummy submissions and test results.

> python manage.py runscript dashboard-filler --script-args course_id=1 [nocheck]

Arguments:
- course_id: ID of the course to fill (optional)
- nocheck: skip the confirmation step (optional)
"""


class bcolors:
    HEADER = "\033[95m"
    OKBLUE = "\033[94m"
    OKCYAN = "\033[96m"
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


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


def confirmation_step():
    print(f"Present submissions will be {bcolors.WARNING}deleted{bcolors.ENDC}.")
    confirmation = input("Are you sure ? [y/N] ")
    if confirmation != "y":
        print("Aborting.")
        exit()


def run(*args):
    if not args:
        print(
            "Usage : python manage.py runscript dashboard-filler --script-args course_id=1 [nocheck]"
        )
        return

    # ID of the course you want to fill
    if "course_id" in args[0]:
        COURSE_ID = int(args[0].split("=")[1])
    else:
        COURSE_ID = input("Course ID: ")

    # Get the course
    course = Course.objects.get(id=COURSE_ID)

    # Confirmation step
    print(
        f"{bcolors.OKBLUE}{course.title}{bcolors.ENDC} will be filled with dummy submissions."
    )
    if "nocheck" not in args:
        confirmation_step()

    # Get all course students
    students = course.students.all()

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
    print("Done.")
