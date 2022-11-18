from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from api.models import Course, Session, Exercise
from .models import Submission, TestResult


# Create your tests here.
class UserTest(TestCase):
    """
    Test User interactions
    """

    def setUp(self):
        user = User.objects.create_user("testuser", "test@test.test", "testpwd")
        user.save()

    def tearDown(self):
        user = User.objects.get(username="testuser")
        user.delete()

    def test_auth(self):
        user = authenticate(username="testuser", password="testpwd")
        self.assertNotEqual(user, None)

    def test_auth_fail_wrong_password(self):
        user = authenticate(username="testuser", password="testpwd2")
        self.assertEqual(user, None)

    def test_auth_fail_wrong_user(self):
        user = authenticate(username="testuser2", password="testpwd")
        self.assertEqual(user, None)

    def test_auth_fail_wrong_user_and_password(self):
        user = authenticate(username="testuser2", password="testpwd2")
        self.assertEqual(user, None)

    def test_auth_fail_no_data_provided(self):
        user = authenticate(username="", password="")
        self.assertEqual(user, None)

    def test_auth_fail_no_password_provided(self):
        user = authenticate(username="testuser", password="")
        self.assertEqual(user, None)

    def test_auth_fail_no_user_provided(self):
        user = authenticate(username="", password="testpwd")
        self.assertEqual(user, None)


class Student_CourseSessionExerciseTest(TestCase):
    """
    Test Course, Session, Exercise interactions from student viewpoint
    """

    def setUp(self):
        teacher = User.objects.create_user("teacher")
        teacher.save()

        student = User.objects.create(
            username="testuser", password="testpwd", email="testmail@mail.com"
        )
        student.save()

        course = Course.objects.create(title="testcourse", owner=teacher)
        course.students.add(student)
        course.save()

        inaccessible_course = Course.objects.create(
            title="inaccessible_course", owner=teacher
        )
        inaccessible_course.save()

        session = Session.objects.create(title="testsession", course=course)
        session.save()

        inaccessible_session = Session.objects.create(
            title="inaccessible_session", course=inaccessible_course
        )
        inaccessible_session.save()

        exercise = Exercise.objects.create(title="testexercise", session=session)
        exercise.save()

        inaccessible_exercise = Exercise.objects.create(
            title="inaccessible_exercise", session=inaccessible_session
        )
        inaccessible_exercise.save()

    def test_student_can_access_course(self):
        student = User.objects.get(username="testuser")
        course = Course.objects.get(title="testcourse")
        self.assertTrue(student in course.students.all())

    def test_student_cannot_access_inaccessible_course(self):
        student = User.objects.get(username="testuser")
        course = Course.objects.get(title="inaccessible_course")
        self.assertFalse(student in course.students.all())


class Teacher_CourseSessionExerciseTest(TestCase):
    """
    Test Course, Session, Exercise interactions from teacher viewpoint
    """

    def setUp(self):
        teacher = User.objects.create_user("teacher")
        teacher.save()

        other_teacher = User.objects.create_user("other_teacher")
        other_teacher.save()

        student = User.objects.create(
            username="testuser", password="testpwd", email="testmail@mail.com"
        )
        student.save()

        course = Course.objects.create(title="testcourse", owner=teacher)
        course.students.add(student)
        course.save()

        inaccessible_course = Course.objects.create(
            title="inaccessible_course", owner=other_teacher
        )
        inaccessible_course.save()

        session = Session.objects.create(title="testsession", course=course)
        session.save()

        inaccessible_session = Session.objects.create(
            title="inaccessible_session", course=inaccessible_course
        )
        inaccessible_session.save()

        exercise = Exercise.objects.create(title="testexercise", session=session)
        exercise.save()

        inaccessible_exercise = Exercise.objects.create(
            title="inaccessible_exercise", session=inaccessible_session
        )
        inaccessible_exercise.save()

    def test_teacher_can_create_new_course(self):
        teacher = User.objects.get(username="teacher")
        new_course = Course.objects.create(title="new_course", owner=teacher)
        new_course.save()
        self.assertEqual(teacher, new_course.owner)

    def test_can_create_session_in_course(self):
        course = Course.objects.get(title="testcourse")
        new_session = Session.objects.create(title="new_session", course=course)
        new_session.save()
        self.assertEqual(course, new_session.course)

    def test_can_create_exercise_in_session(self):
        session = Session.objects.get(title="testsession")
        new_exercise = Exercise.objects.create(title="new_exercise", session=session)
        new_exercise.save()
        self.assertEqual(session, new_exercise.session)


class StudentSubmissionTest(TestCase):
    """
    Test Student Submission interactions
    """

    fixtures = ["student_submission_test_fixtures.json"]

    def test_student_can_access_course(self):
        student = User.objects.get(username="student")
        course = Course.objects.get(title="teacher's first course")
        self.assertTrue(student in course.students.all())

    def test_student_can_create_submission(
        self,
    ):
        student = User.objects.get(username="student")
        exercise = Exercise.objects.get(title="Double String")
        submission = Submission.objects.create(
            exercise=exercise, owner=student, file="test_files/double_string.py"
        )
        submission.save()


