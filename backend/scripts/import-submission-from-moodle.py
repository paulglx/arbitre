"""
Use moodle-exported data to batch submit on exercises

> python manage.py runscript import-submission-from-moodle --script-args <students_csv> <submissions_dir>

Arguments:
- students_csv: A CSV file containing at least SURNAME, NAME, MAIL rows at the beginning.
- submissions_dir: Path to a directory containing Moodle-extracted data

  Example tree in submissions_dir :

  submissions_dir/
  ├─ Doe John_12345_assignsubmission_file
  │  ├─ exercise_1.py
  │  └─ exercise_2.py
  └─ Foo Jane_56749_assignsubmission_file
     ├─ exercise_1.py
     └─ exercise_2.py

  Manual adjustment of filenames might be necessary.

"""

import os
import csv

from django.db.utils import IntegrityError
from api.models import Exercise, Course
from runner.models import Submission
from django.contrib.auth.models import User


class bcolors:
    HEADER = "\033[95m"
    OKBLUE = "\033[94m"
    OKCYAN = "\033[96m"
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    UNDERLINE = "\033[4m"


def warning(s):
    print(f"{bcolors.WARNING}⚠ {s}{bcolors.ENDC}")


def fail(s):
    print(f"{bcolors.FAIL}✗ {s}{bcolors.ENDC}")


def success(s):
    print(f"{bcolors.OKGREEN}✓ {s}{bcolors.ENDC}")


def ok(s):
    print(f"{bcolors.OKBLUE}{s}{bcolors.ENDC}")


def run(*args):
    if len(args) != 2:
        fail(
            "Usage: python manage.py runscript import-submission-from-moodle --script-args <students_csv> <submissions_dir>"
        )
        return

    # Check Arguments
    students_csv, submissions_dir = args

    if not os.path.isdir(submissions_dir):
        fail(f"{submissions_dir} is not a directory")
        return

    # Check CSV file
    # Create "fullname_to_user" dict
    # Dict : Surname Name -> User
    # Useful to create user->path mapping (next step)
    fullname_to_user = dict()
    total_students_to_store = 0
    with open(students_csv) as csvfile:
        reader = csv.reader(csvfile, delimiter=";")
        next(reader)  # Skip header
        for row in reader:
            surname, name, email, *_ = row
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                fail(f"Unable to find user with mail {email} ({surname} {name})")
                continue

            fullname_to_user[f"{surname.lower()} {name.lower()}"] = user
            total_students_to_store += 1

    if total_students_to_store == len(fullname_to_user):
        success(
            f"{len(fullname_to_user)} students successfully read from {students_csv}"
        )
    else:
        warning(
            f"Got {len(fullname_to_user)}/{total_students_to_store} students from {students_csv}"
        )

    # Prompt user to fill filename->exercise
    # exercises : dict(key: filename, value: Exercise)
    filename_to_exercise = dict()

    ok("""This script will submit one file to one exercise, for all students.
Let's create this file-to-exercise mapping.\n""")

    while True:
        stop_indication = (
            " | 'return' if done" if len(filename_to_exercise.keys()) > 0 else ""
        )

        exercise_id = input(
            f"Exercise ID {bcolors.DIM}'?' to list exercises{stop_indication}{bcolors.ENDC}\n→ "
        )
        if exercise_id == "":
            if len(filename_to_exercise.keys()) > 0:
                break
            else:
                continue
        if exercise_id == "?":
            all_exercises = Exercise.objects.all()
            ok(
                "\n".join(
                    f"{exercise.id}: {exercise.title} ({exercise.session.course})"
                    for exercise in all_exercises
                )
            )
            continue
        try:
            exercise = Exercise.objects.get(id=int(exercise_id))
        except Exercise.DoesNotExist:
            fail("This exercise does not exist")
            continue

        filename = input(
            f"Map {bcolors.BOLD}{exercise.title}{bcolors.ENDC} to what filename ?\n→ "
        )
        filename_to_exercise[filename] = exercise
        success(f"Files named {filename} will be submitted to {exercise.title}")

    ok(f"\nMapping ('filename': exercise_id): \n{filename_to_exercise}")

    # Check that all exercises are on the same course
    some_exercise = next(iter(filename_to_exercise.values()))
    course = some_exercise.session.course
    for exercise in filename_to_exercise.values():
        if exercise.session.course != course:
            fail("Provided exercises aren't under the same course")
            return

    # Create "files_to_send" dict (with empty values)
    # Dict : User -> Path of directory containing submission files (like `Doe John_12345_assignsubmission_file`)
    files_to_send = dict()
    expected_files = set(filename_to_exercise.keys())
    for dir in os.listdir(submissions_dir):
        dir_path = os.path.join(submissions_dir, dir)
        if not os.path.isdir(dir_path):
            fail(f"{dir_path} isn't a directory")
            continue

        # Get student
        fullname = dir.split("_")[0]
        try:
            student = fullname_to_user[fullname.lower()]
        except KeyError:
            fail(f"Found files for {fullname} but they're missing from the CSV")
            continue

        # Check whether there are missing or extra files
        student_files = set(os.listdir(dir_path))
        student_extra = student_files.difference(expected_files)
        expected_extra = expected_files.difference(student_files)

        if expected_extra:
            fail(f"{student.username} is missing files: {expected_extra}")
            continue
        if student_extra:
            warning(f"{student.username} got extra files: {student_extra}")

        files_to_send[student] = dir_path

    # Create submissions (aka send files !)
    for student, path in files_to_send.items():
        for file in os.listdir(path):
            try:
                exercise = filename_to_exercise[file]
            except KeyError:
                continue

            full_path = os.path.join(path, file)

            try:
                submission = Submission(
                    exercise=exercise, file=full_path, owner=student
                )
                submission.save()

                ok(f"{student} submitted {file} on {exercise}")
            except IntegrityError:
                fail(f"{student} already submitted a file on {exercise}")
                continue
