from django.test import TestCase, Client
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from api.models import Course, Session, Exercise


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


class SimpleJWTTest(TestCase):
    """
    Test SimpleJWT interactions
    """

    BASE_URL = "http://localhost:8000"

    @classmethod
    def setUpClass(cls):
        cls.client = Client()
        endpoint = "/api/auth/users/"
        body = {
            "username": "apitestuser",
            "password": "apitestpwd",
        }
        cls.client.post(cls.BASE_URL + endpoint, data=body)
        super().setUpClass()

    def test_login_user_via_api(self):
        endpoint = "/api/auth/token/"
        body = {
            "username": "apitestuser",
            "password": "apitestpwd",
        }
        response = self.client.post(self.BASE_URL + endpoint, data=body)
        self.assertEqual(response.status_code, 200)

    def test_login_user_via_api_fail_wrong_password(self):
        endpoint = "/api/auth/token/"
        body = {
            "username": "apitestuser",
            "password": "apitestpwd2",
        }
        response = self.client.post(self.BASE_URL + endpoint, data=body)
        self.assertEqual(response.status_code, 401)

    def test_refresh_token_via_api(self):
        endpoint = "/api/auth/token/"
        body = {
            "username": "apitestuser",
            "password": "apitestpwd",
        }
        response = self.client.post(self.BASE_URL + endpoint, data=body)

        token = response.json()["refresh"]

        endpoint = "/api/auth/token/refresh/"
        body = {
            "refresh": token,
        }
        response = self.client.post(self.BASE_URL + endpoint, data=body)
        self.assertEqual(response.status_code, 200)

    def test_refresh_token_via_api_fail_wrong_token(self):
        endpoint = "/api/auth/token/refresh/"
        body = {
            "refresh": "thisisawrongtoken",
        }
        response = self.client.post(self.BASE_URL + endpoint, data=body)
        self.assertEqual(response.status_code, 401)

    def test_logout_user_via_api(self):
        endpoint = "/api/auth/token/"
        body = {
            "username": "apitestuser",
            "password": "apitestpwd",
        }
        response = self.client.post(self.BASE_URL + endpoint, data=body)

        token = response.json()["refresh"]

        endpoint = "/api/auth/logout/"
        body = {
            "refresh": token,
        }
        response = self.client.post(self.BASE_URL + endpoint, data=body)
        self.assertEqual(response.status_code, 200)

    def test_logout_user_via_api_fail_wrong_token(self):
        endpoint = "/api/auth/logout/"
        body = {
            "refresh": "thisisawrongtoken",
        }
        with self.assertRaises(Exception):
            self.client.post(self.BASE_URL + endpoint, data=body)


class UserGroupTest(TestCase):
    """
    Test UserGroup interactions
    """

    def setUp(self):
        User.objects.create_user("test", "", "test")

        g1 = Group.objects.create(name="testgroup1")
        g2 = Group.objects.create(name="testgroup2")

        g1.save()
        g2.save()

        user = User.objects.get(username="test")
        user.groups.add(g1)
        user.save()

    def test_get_groups_via_api(self):

        endpoint = "/api/auth/users/groups/"
        body = {
            "username": "test",
        }
        response = self.client.post(endpoint, data=body)
        self.assertEqual(response.status_code, 200)


class TeacherTest(TestCase):
    """
    Test Teacher interactions
    """

    def setUp(self):
        User.objects.create_user("teacher1", "", "teacher1")
        User.objects.create_user("teacher2", "", "teacher2")

        gs = Group.objects.create(name="students")
        gt = Group.objects.create(name="teachers")

        gs.save()
        gt.save()

        user = User.objects.get(username="teacher1")
        user.groups.add(gs)
        user.save()

        user = User.objects.get(username="teacher2")
        user.groups.add(gt)
        user.save()

    def test_get_all_teachers(self):
        endpoint = "/api/auth/teachers/"
        response = self.client.get(endpoint)
        self.assertEqual(response.status_code, 200)


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

        course = Course.objects.create(title="testcourse")
        course.owners.add(teacher)
        course.students.add(student)
        course.save()

        inaccessible_course = Course.objects.create(title="inaccessible_course")
        inaccessible_course.owners.add(teacher)
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

    def test_course_string_is_title(self):
        course = Course.objects.get(title="testcourse")
        self.assertEqual(str(course), course.title)

    def test_session_string_is_course_title_plus_semicolon_plus_title(self):
        session = Session.objects.get(title="testsession")
        self.assertEqual(
            str(session), session.course.title + " : " + session.title
        )

    def test_exercise_string_is_title(self):
        exercise = Exercise.objects.get(title="testexercise")
        self.assertEqual(str(exercise), exercise.title)

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

        course = Course.objects.create(title="testcourse")
        course.owners.add(teacher)
        course.students.add(student)
        course.save()

        inaccessible_course = Course.objects.create(title="inaccessible_course")
        inaccessible_course.owners.add(other_teacher)
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
        new_course = Course.objects.create(title="new_course")
        new_course.owners.add(teacher)
        new_course.save()
        self.assertTrue(teacher in new_course.owners.all())

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
