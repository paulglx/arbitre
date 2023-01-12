from api.models import Course, Session, Exercise
from django.contrib.auth import authenticate
from django.contrib.auth.models import User, Group
from django.test import TestCase, Client
from runner.models import Submission, Test
from runner.serializers import SubmissionSerializer


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
        user = User.objects.create_user("apitestuser", "", "apitestpwd")
        user.save()

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
        response = self.client.post(self.BASE_URL + endpoint, data=body)
        self.assertEqual(response.status_code, 400)

    def test_register_user_via_api(self):
        endpoint = "/api/auth/users/"
        data = {
            "username": "sjwttestuser",
            "password": "sjwttestpwd",
        }
        response = self.client.get(self.BASE_URL + endpoint, data)
        self.assertEqual(response.status_code, 200)

    def test_get_all_users_via_api(self):
        endpoint = "/api/auth/token/"
        body = {
            "username": "apitestuser",
            "password": "apitestpwd",
        }
        response = self.client.post(self.BASE_URL + endpoint, data=body)

        token = response.json()["access"]

        endpoint = "/api/auth/users/"
        body = {
            "HTTP_AUTHORIZATION": "Bearer " + token,
        }
        response = self.client.get(self.BASE_URL + endpoint, **body)
        self.assertEqual(response.status_code, 200)


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


"""     def test_get_groups_via_api(self):

        endpoint = "/api/auth/users/groups/"
        body = {
            "username": "test",
        }
        response = self.client.post(endpoint, data=body)
        self.assertEqual(response.status_code, 200) """


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

        # login as teacher1
        endpoint = "/api/auth/token/"
        body = {
            "username": "teacher1",
            "password": "teacher1",
        }
        response = self.client.post(endpoint, data=body)

        token = response.json()["access"]

        endpoint = "/api/auth/teachers/"
        body = {
            "HTTP_AUTHORIZATION": "Bearer " + token,
        }
        response = self.client.get(endpoint, **body)
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
        self.assertEqual(str(session), session.course.title + " : " + session.title)

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


class CourseAPITest(TestCase):
    """
    Test Course API
    """

    TOKEN = ""
    BASE_URL = "http://localhost:8000"

    @classmethod
    def setUpClass(cls):
        cls.client = Client()

        teacher = User.objects.create_user(
            username="course_test_teacher", password="course_test_teacher"
        )
        teacher.save()

        # Log in as teacher
        response = cls.client.post(
            cls.BASE_URL + "/api/auth/token/",
            {"username": "course_test_teacher", "password": "course_test_teacher"},
            format="json",
        )
        cls.TOKEN = response.data["access"]

        super(CourseAPITest, cls).setUpClass()

    def test_get_courses(self):
        endpoint = self.BASE_URL + "/api/course/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )
        self.assertEqual(response.status_code, 200)

    def test_get_all_courses(self):
        endpoint = self.BASE_URL + "/api/course/?all=true"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )
        self.assertEqual(response.status_code, 200)

    def test_create_course(self):
        endpoint = self.BASE_URL + "/api/course/"
        data = {"title": "testcourse", "description": "testdescription"}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )
        self.assertEqual(response.status_code, 201)

    def test_get_all_user_courses(self):
        endpoint = self.BASE_URL + "/api/course/"
        data = {"title": "testcourse", "description": "testdescription"}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        endpoint = self.BASE_URL + "/api/course/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)

    def test_get_course(self):
        endpoint = self.BASE_URL + "/api/course/"
        data = {"title": "testcourse", "description": "testdescription"}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        endpoint = self.BASE_URL + "/api/course/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        course_id = response.data[0]["id"]

        endpoint = self.BASE_URL + f"/api/course/{course_id}/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )
        self.assertEqual(response.status_code, 200)


class CourseOwnersTest(TestCase):

    TOKEN = ""
    BASE_URL = "http://localhost:8000"

    @classmethod
    def setUpClass(cls):
        cls.client = Client()

        teacher1 = User.objects.create_user(
            username="cot_teacher1", password="cot_teacher1"
        )
        teacher1.save()

        teacher2 = User.objects.create_user(
            username="cot_teacher2", password="cot_teacher2"
        )
        teacher2.save()

        # Log in as teacher
        response = cls.client.post(
            cls.BASE_URL + "/api/auth/token/",
            {"username": "cot_teacher1", "password": "cot_teacher1"},
            format="json",
        )
        cls.TOKEN = response.data["access"]

        super(CourseOwnersTest, cls).setUpClass()

    def test_get_course_owners(self):
        endpoint = self.BASE_URL + "/api/course/"
        data = {"title": "testcourse", "description": "testdescription"}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        endpoint = self.BASE_URL + "/api/course/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        course_id = response.data[0]["id"]

        endpoint = self.BASE_URL + f"/api/course_owner/?course_id={course_id}"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )
        self.assertEqual(response.status_code, 200)

    def test_add_course_owner(self):

        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        owner = User.objects.create_user(username="cot_owner", password="cot_owner")
        course.owners.add(owner)
        course.save()

        other_user = User.objects.create_user(
            username="cot_other_user", password="cot_other_user"
        )
        other_user.save()

        # login owner
        response = self.client.post(
            self.BASE_URL + "/api/auth/token/",
            {"username": "cot_owner", "password": "cot_owner"},
            format="json",
        )
        COT_TOKEN = response.data["access"]

        endpoint = self.BASE_URL + "/api/course_owner/"
        data = {"course_id": course.id, "user_id": other_user.id}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {COT_TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)

    def test_add_course_owner_already_owner(self):
        endpoint = self.BASE_URL + "/api/course/"
        data = {"title": "testcourse", "description": "testdescription"}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        endpoint = self.BASE_URL + "/api/course/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        course_id = response.data[0]["id"]

        endpoint = self.BASE_URL + "/api/course_owner/"
        data = {"course_id": course_id, "user_id": 2}
        self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.data["message"], "User is already an owner")

    def test_add_course_owner_owner_doesnt_exist(self):
        endpoint = self.BASE_URL + "/api/course/"
        data = {"title": "testcourse", "description": "testdescription"}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        endpoint = self.BASE_URL + "/api/course/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        course_id = response.data[0]["id"]

        endpoint = self.BASE_URL + "/api/course_owner/"
        data = {"course_id": course_id, "user_id": 34523452346346}
        with self.assertRaises(User.DoesNotExist):
            self.client.post(
                endpoint,
                data,
                content_type="application/json",
                **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
            )

    def test_add_course_owner_course_doesnt_exist(self):
        endpoint = self.BASE_URL + "/api/course/"
        data = {"title": "testcourse", "description": "testdescription"}
        self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        endpoint = self.BASE_URL + "/api/course_owner/"
        data = {"course_id": 346435745, "user_id": 2}
        with self.assertRaises(Course.DoesNotExist):
            self.client.post(
                endpoint,
                data,
                content_type="application/json",
                **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
            )

    def test_add_course_owner_user_is_not_course_owner(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.save()

        not_an_owner = User.objects.create_user(
            username="cot_not_an_owner", password="cot_not_an_owner"
        )
        not_an_owner.save()

        # Login as cot_not_an_owner
        response = self.client.post(
            self.BASE_URL + "/api/auth/token/",
            {"username": "cot_not_an_owner", "password": "cot_not_an_owner"},
            format="json",
        )
        COT_NOT_OWNER_TOKEN = response.data["access"]

        endpoint = self.BASE_URL + "/api/course_owner/"
        data = {"course_id": course.id, "user_id": not_an_owner.id}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {COT_NOT_OWNER_TOKEN}"},
        )
        self.assertEqual(response.data["message"], "Forbidden: User is not an owner")

    def test_add_course_owner_user_is_already_tutor(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        teacher1 = User.objects.get(username="cot_teacher1")
        teacher2 = User.objects.get(username="cot_teacher2")
        course.owners.add(teacher1)
        course.tutors.add(teacher2)
        course.save()

        endpoint = self.BASE_URL + "/api/course_owner/"
        data = {"course_id": course.id, "user_id": teacher2.id}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )
        self.assertEqual(
            response.data["message"], "User is already a tutor of this course"
        )

    def test_remove_course_owner(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        teacher1 = User.objects.get(username="cot_teacher1")
        teacher2 = User.objects.get(username="cot_teacher2")
        course.owners.add(teacher1)
        course.owners.add(teacher2)
        course.save()

        endpoint = self.BASE_URL + f"/api/course_owner/{course.id}/"
        data = {"user_id": teacher2.id}
        response = self.client.delete(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Owner removed from course")

    def test_remove_course_owner_user_not_owner(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        teacher1 = User.objects.get(username="cot_teacher1")
        teacher2 = User.objects.get(username="cot_teacher2")
        course.owners.add(teacher1)
        course.save()

        endpoint = self.BASE_URL + f"/api/course_owner/{course.id}/"
        data = {"user_id": teacher2.id}
        response = self.client.delete(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["message"], "User is not an owner")

    def test_remove_course_owner_unauthorized(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        teacher1 = User.objects.get(username="cot_teacher1")
        teacher2 = User.objects.get(username="cot_teacher2")
        course.owners.add(teacher1)
        course.save()

        # login as teacher2 and store refresh token
        response = self.client.post(
            self.BASE_URL + "/api/auth/token/",
            {"username": "cot_teacher2", "password": "cot_teacher2"},
            format="json",
        )
        TOKEN = response.data["access"]

        endpoint = self.BASE_URL + f"/api/course_owner/{course.id}/"
        data = {"user_id": teacher2.id}
        response = self.client.delete(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {TOKEN}"},
        )

        self.assertEqual(response.status_code, 403)


class CourseTutorsTest(TestCase):

    TOKEN = ""
    BASE_URL = "http://localhost:8000"

    @classmethod
    def setUpClass(cls):
        cls.client = Client()

        teacher1 = User.objects.create_user(
            username="ctt_teacher1", password="ctt_teacher1"
        )
        teacher1.save()

        teacher2 = User.objects.create_user(
            username="ctt_teacher2", password="ctt_teacher2"
        )
        teacher2.save()

        # Log in as teacher
        response = cls.client.post(
            cls.BASE_URL + "/api/auth/token/",
            {"username": "ctt_teacher1", "password": "ctt_teacher1"},
            format="json",
        )
        cls.TOKEN = response.data["access"]

        super(CourseTutorsTest, cls).setUpClass()

    def test_get_course_tutors(self):
        endpoint = self.BASE_URL + "/api/course/"
        data = {"title": "testcourse", "description": "testdescription"}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        endpoint = self.BASE_URL + "/api/course/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        course_id = response.data[0]["id"]

        endpoint = self.BASE_URL + f"/api/course_tutor/?course_id={course_id}"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )
        self.assertEqual(response.status_code, 200)

    def test_add_course_tutor(self):

        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        owner = User.objects.create_user(username="ctt_owner", password="ctt_owner")
        course.owners.add(owner)
        course.save()

        other_user = User.objects.create_user(
            username="ctt_other_user", password="ctt_other_user"
        )
        other_user.save()

        # login owner
        response = self.client.post(
            self.BASE_URL + "/api/auth/token/",
            {"username": "ctt_owner", "password": "ctt_owner"},
            format="json",
        )
        ctt_TOKEN = response.data["access"]

        endpoint = self.BASE_URL + "/api/course_tutor/"
        data = {"course_id": course.id, "user_id": other_user.id}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {ctt_TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)

    def test_add_course_tutor_already_tutor(self):
        endpoint = self.BASE_URL + "/api/course/"
        data = {"title": "testcourse", "description": "testdescription"}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        endpoint = self.BASE_URL + "/api/course/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        course_id = response.data[0]["id"]

        endpoint = self.BASE_URL + "/api/course_tutor/"
        data = {"course_id": course_id, "user_id": 2}
        self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.data["message"], "User is already a tutor")

    def test_add_course_tutor_tutor_doesnt_exist(self):
        endpoint = self.BASE_URL + "/api/course/"
        data = {"title": "testcourse", "description": "testdescription"}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        endpoint = self.BASE_URL + "/api/course/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        course_id = response.data[0]["id"]

        endpoint = self.BASE_URL + "/api/course_tutor/"
        data = {"course_id": course_id, "user_id": 34523452346346}
        with self.assertRaises(User.DoesNotExist):
            self.client.post(
                endpoint,
                data,
                content_type="application/json",
                **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
            )

    def test_add_course_tutor_course_doesnt_exist(self):
        endpoint = self.BASE_URL + "/api/course/"
        data = {"title": "testcourse", "description": "testdescription"}
        self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        endpoint = self.BASE_URL + "/api/course_tutor/"
        data = {"course_id": 346435745, "user_id": 2}
        with self.assertRaises(Course.DoesNotExist):
            self.client.post(
                endpoint,
                data,
                content_type="application/json",
                **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
            )

    def test_add_course_tutor_user_is_not_course_owner(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.save()

        not_an_owner = User.objects.create_user(
            username="ctt_not_an_owner", password="ctt_not_an_owner"
        )
        not_an_owner.save()

        # Login as ctt_not_an_owner
        response = self.client.post(
            self.BASE_URL + "/api/auth/token/",
            {"username": "ctt_not_an_owner", "password": "ctt_not_an_owner"},
            format="json",
        )
        ctt_NOT_owner_TOKEN = response.data["access"]

        endpoint = self.BASE_URL + "/api/course_tutor/"
        data = {"course_id": course.id, "user_id": not_an_owner.id}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {ctt_NOT_owner_TOKEN}"},
        )
        self.assertEqual(response.data["message"], "Forbidden: User is not an owner")

    def test_add_course_tutor_user_is_owner(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )

        owner = User.objects.get(username="ctt_teacher1")
        course.owners.add(owner)
        course.save()

        endpoint = self.BASE_URL + "/api/course_tutor/"
        data = {"course_id": course.id, "user_id": owner.id}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )
        self.assertEqual(
            response.data["message"], "Unchanged: User is an owner of this course"
        )
        self.assertEqual(response.status_code, 409)

    def test_remove_course_tutor(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        teacher1 = User.objects.get(username="ctt_teacher1")
        teacher2 = User.objects.get(username="ctt_teacher2")
        course.owners.add(teacher1)
        course.tutors.add(teacher2)
        course.save()

        endpoint = self.BASE_URL + f"/api/course_tutor/{course.id}/"
        data = {"user_id": teacher2.id}
        response = self.client.delete(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Tutor removed from course")

    def test_remove_course_tutor_user_not_tutor(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        teacher1 = User.objects.get(username="ctt_teacher1")
        teacher2 = User.objects.get(username="ctt_teacher2")
        course.owners.add(teacher1)
        course.save()

        endpoint = self.BASE_URL + f"/api/course_tutor/{course.id}/"
        data = {"user_id": teacher2.id}
        response = self.client.delete(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["message"], "User is not a tutor")

    def test_remove_course_tutor_unauthorized(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        teacher1 = User.objects.get(username="ctt_teacher1")
        teacher2 = User.objects.get(username="ctt_teacher2")
        course.tutors.add(teacher1)
        course.save()

        response = self.client.post(
            self.BASE_URL + "/api/auth/token/",
            {"username": "ctt_teacher2", "password": "ctt_teacher2"},
            format="json",
        )
        TOKEN = response.data["access"]

        endpoint = self.BASE_URL + f"/api/course_tutor/{course.id}/"
        data = {"user_id": teacher2.id}
        response = self.client.delete(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {TOKEN}"},
        )

        self.assertEqual(response.status_code, 403)


class CourseStudentsTest(TestCase):

    TOKEN = ""
    BASE_URL = "http://localhost:8000"

    @classmethod
    def setUpClass(cls):
        cls.client = Client()

        teacher = User.objects.create_user(
            username="cst_teacher1", password="cst_teacher1"
        )
        teacher.save()

        course = Course.objects.create(title="cst_course", description="cst_course")
        course.owners.add(teacher)
        course.save()

        # Log in as teacher
        response = cls.client.post(
            cls.BASE_URL + "/api/auth/token/",
            {"username": "cst_teacher1", "password": "cst_teacher1"},
            format="json",
        )
        cls.TOKEN = response.data["access"]

        super(CourseStudentsTest, cls).setUpClass()

    def test_get_course_students(self):
        course = Course.objects.get(title="cst_course")
        student = User.objects.create_user(
            username="cst_student1", password="cst_student1"
        )
        student.save()
        course.students.add(student)
        course.save()

        endpoint = self.BASE_URL + f"/api/course_student/?course_id={course.id}"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_add_course_student(self):
        course = Course.objects.get(title="cst_course")
        student = User.objects.create_user(
            username="cst_student1", password="cst_student1"
        )
        student.save()

        endpoint = self.BASE_URL + "/api/course_student/"
        data = {"course_id": course.id, "user_id": student.id}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Student added to course")

    def test_add_course_student_already_in_course(self):
        course = Course.objects.get(title="cst_course")
        student = User.objects.create_user(
            username="cst_student2", password="cst_student2"
        )
        student.save()
        course.students.add(student)
        course.save()

        endpoint = self.BASE_URL + "/api/course_student/"
        data = {"course_id": course.id, "user_id": student.id}
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )
        self.assertEqual(response.status_code, 409)
        self.assertEqual(
            response.data["message"], "User is already a student of this course"
        )

    def test_remove_course_student(self):
        course = Course.objects.get(title="cst_course")
        student = User.objects.create_user(
            username="cst_student3", password="cst_student3"
        )
        student.save()
        course.students.add(student)
        course.save()

        endpoint = self.BASE_URL + f"/api/course_student/{course.id}/"
        data = {"user_id": student.id}
        response = self.client.delete(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Student removed from course")


class SessionAPITest(TestCase):
    """
    Test Session API
    """

    TOKEN = ""
    BASE_URL = "http://localhost:8000"

    @classmethod
    def setUpClass(cls):
        cls.client = Client()

        teacher = User.objects.create_user(
            username="session_test_teacher", password="session_test_teacher"
        )
        teacher.save()

        # Log in as teacher
        response = cls.client.post(
            cls.BASE_URL + "/api/auth/token/",
            {"username": "session_test_teacher", "password": "session_test_teacher"},
            format="json",
        )
        cls.TOKEN = response.data["access"]

        super(SessionAPITest, cls).setUpClass()

    def test_create_session(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.save()

        endpoint = self.BASE_URL + "/api/session/"
        data = {
            "course_id": course.id,
            "title": "testsession",
            "description": "testdescription",
        }
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], "testsession")

    def test_create_session_unauthorized(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.save()

        endpoint = self.BASE_URL + "/api/session/"
        data = {
            "course_id": course.id,
            "title": "testsession",
            "description": "testdescription",
        }
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 401)

    def test_get_sessions_of_course(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.save()

        session1 = Session.objects.create(
            course=course, title="testsession1", description="testdescription"
        )
        session2 = Session.objects.create(
            course=course, title="testsession2", description="testdescription"
        )
        session1.save()
        session2.save()

        endpoint = self.BASE_URL + f"/api/session/?course_id={course.id}"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_get_all_sessions(self):
        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.save()

        session1 = Session.objects.create(
            course=course, title="testsession1", description="testdescription"
        )
        session2 = Session.objects.create(
            course=course, title="testsession2", description="testdescription"
        )
        session1.save()
        session2.save()

        endpoint = self.BASE_URL + "/api/session/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)


class ExerciseAPITest(TestCase):
    """
    Test Exercise
    """

    TOKEN = ""
    BASE_URL = "http://localhost:8000"

    @classmethod
    def setUpClass(cls):
        cls.client = Client()

        teacher = User.objects.create_user(
            username="exercise_test_teacher", password="exercise_test_teacher"
        )
        teacher.save()

        # Log in as teacher
        response = cls.client.post(
            cls.BASE_URL + "/api/auth/token/",
            {"username": "exercise_test_teacher", "password": "exercise_test_teacher"},
            format="json",
        )
        cls.TOKEN = response.data["access"]

        super(ExerciseAPITest, cls).setUpClass()

    def test_create_exercise(self):
        teacher = User.objects.get(username="exercise_test_teacher")

        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.owners.add(teacher)
        course.save()

        session = Session.objects.create(
            title="testsession", description="testdescription", course=course
        )
        session.save()

        endpoint = self.BASE_URL + "/api/exercise/"
        data = {
            "session_id": session.id,
            "title": "testexercise",
            "description": "testdescription",
        }
        response = self.client.post(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 201)

    def test_edit_exercise(self):
        teacher = User.objects.get(username="exercise_test_teacher")

        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.owners.add(teacher)
        course.save()

        session = Session.objects.create(
            title="testsession", description="testdescription", course=course
        )
        session.save()

        exercise = Exercise.objects.create(
            title="testexercise", description="testdescription", session=session
        )
        exercise.save()

        endpoint = self.BASE_URL + f"/api/exercise/{exercise.id}/"
        data = {
            "title": "testexercise",
            "description": "testdescription",
            "session_id": session.id,
        }
        response = self.client.put(
            endpoint,
            data,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)

    def test_delete_exercise(self):
        teacher = User.objects.get(username="exercise_test_teacher")

        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.owners.add(teacher)
        course.save()

        session = Session.objects.create(
            title="testsession", description="testdescription", course=course
        )
        session.save()

        exercise = Exercise.objects.create(
            title="testexercise", description="testdescription", session=session
        )
        exercise.save()

        endpoint = self.BASE_URL + f"/api/exercise/{exercise.id}/"
        response = self.client.delete(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 204)

    def test_get_exercise(self):
        teacher = User.objects.get(username="exercise_test_teacher")

        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.owners.add(teacher)
        course.save()

        session = Session.objects.create(
            title="testsession", description="testdescription", course=course
        )
        session.save()

        exercise = Exercise.objects.create(
            title="testexercise", description="testdescription", session=session
        )
        exercise.save()

        endpoint = self.BASE_URL + f"/api/exercise/{exercise.id}/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)

    def test_get_exercises_of_session(self):
        teacher = User.objects.get(username="exercise_test_teacher")

        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.owners.add(teacher)
        course.save()

        session = Session.objects.create(
            title="testsession", description="testdescription", course=course
        )
        session.save()

        exercise1 = Exercise.objects.create(
            title="testexercise1", description="testdescription", session=session
        )
        exercise2 = Exercise.objects.create(
            title="testexercise2", description="testdescription", session=session
        )
        exercise1.save()
        exercise2.save()

        endpoint = self.BASE_URL + f"/api/exercise/?session_id={session.id}"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_get_all_exercises(self):
        teacher = User.objects.get(username="exercise_test_teacher")

        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.owners.add(teacher)
        course.save()

        session1 = Session.objects.create(
            title="testsession1", description="testdescription", course=course
        )
        session2 = Session.objects.create(
            title="testsession2", description="testdescription", course=course
        )
        session1.save()
        session2.save()

        exercise1 = Exercise.objects.create(
            title="testexercise1", description="testdescription", session=session1
        )
        exercise2 = Exercise.objects.create(
            title="testexercise2", description="testdescription", session=session2
        )
        exercise1.save()
        exercise2.save()

        endpoint = self.BASE_URL + "/api/exercise/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)


class ResultsOfSessionTest(TestCase):

    BASE_URL = "http://localhost:8000"
    TOKEN = ""

    @classmethod
    def setUpClass(cls):
        cls.client = Client()

        teacher = User.objects.create_user(
            username="ros_test_teacher", password="ros_test_teacher"
        )
        teacher.save()

        # Log in as teacher
        response = cls.client.post(
            cls.BASE_URL + "/api/auth/token/",
            {"username": "ros_test_teacher", "password": "ros_test_teacher"},
            format="json",
        )
        cls.TOKEN = response.data["access"]

        super(ResultsOfSessionTest, cls).setUpClass()

    def test_get_results_of_session(self):

        teacher = User.objects.get(username="ros_test_teacher")

        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.owners.add(teacher)
        course.save()


class CoursesSessionsExercisesTest(TestCase):

    BASE_URL = "http://localhost:8000"
    TOKEN = ""

    @classmethod
    def setUpClass(cls):
        cls.client = Client()

        teacher = User.objects.create_user(
            username="cse_test_teacher", password="cse_test_teacher"
        )
        teacher.save()

        # Log in as teacher
        response = cls.client.post(
            cls.BASE_URL + "/api/auth/token/",
            {"username": "cse_test_teacher", "password": "cse_test_teacher"},
            format="json",
        )
        cls.TOKEN = response.data["access"]

        super(CoursesSessionsExercisesTest, cls).setUpClass()

    def test_get_courses_sessions_exercises_via_api(self):
        teacher = User.objects.get(username="cse_test_teacher")

        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.owners.add(teacher)
        course.save()

        session = Session.objects.create(
            title="testsession", description="testdescription", course=course
        )
        session.save()

        exercise = Exercise.objects.create(
            title="testexercise", description="testdescription", session=session
        )
        exercise.save()

        endpoint = self.BASE_URL + "/api/courses_sessions_exercises/"
        response = self.client.get(
            endpoint,
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        self.assertEqual(response.status_code, 200)


class SubmissionTest(TestCase):
    def test_submission_string_is_file_name(self):

        user = User(username="testuser", password="testpassword")
        user.save()

        course = Course(
            title="testcourse", description="testdescription"
        )
        course.save()

        session = Session(
            title="testsession", description="testdescription", course=course
        )
        session.save()

        exercise = Exercise(
            title="testexercise", description="testdescription", session=session
        )
        exercise.save()

        submission = Submission(
            exercise=exercise,
            file="runner/fixtures/test_files/double_string.py",
            owner=user,
        )
        submission.save()
        self.assertEqual(str(submission), "runner/fixtures/test_files/double_string.py")

    def test_submission_status_on_exercise_with_tests_is_pending(self):

        user = User(username="testuser", password="testpassword")
        user.save()

        course = Course(
            title="testcourse", description="testdescription"
        )
        course.save()

        session = Session(
            title="testsession", description="testdescription", course=course
        )
        session.save()

        exercise = Exercise(
            title="testexercise", description="testdescription", session=session
        )
        exercise.save()

        test = Test(
            exercise=exercise,
            name="testtest",
            stdin="testinput",
            stdout="testoutput",
        )
        test.save()

        submission = Submission(
            exercise=exercise,
            file="runner/fixtures/test_files/double_string.py",
            owner=user,
        )
        submission.save()

        self.assertEqual(submission.status, Submission.SubmissionStatus.PENDING)

    def test_submission_status_on_exercise_without_tests_is_success(self):

        user = User(username="testuser", password="testpassword")
        user.save()

        course = Course(
            title="testcourse", description="testdescription"
        )
        course.save()

        session = Session(
            title="testsession", description="testdescription", course=course
        )
        session.save()

        exercise = Exercise(
            title="testexercise", description="testdescription", session=session
        )
        exercise.save()

        submission = Submission(
            exercise=exercise,
            file="runner/fixtures/test_files/double_string.py",
            owner=user,
        )
        submission.save()

        self.assertEqual(submission.status, Submission.SubmissionStatus.SUCCESS)


class TestTest(TestCase):
    def test_test_string_is_test_name_plus_exercise_name(self):

        course = Course.objects.create(
            title="testcourse", description="testdescription"
        )
        course.save()

        session = Session.objects.create(
            title="testsession", description="testdescription", course=course
        )
        session.save()

        exercise = Exercise.objects.create(
            title="testexercise", description="testdescription", session=session
        )
        exercise.save()

        test = Test.objects.create(
            name="testname", stdin="", stdout="", exercise=exercise
        )
        test.save()
        self.assertEqual(str(test), "testname (testexercise)")


class CourseJoinTest(TestCase):
    BASE_URL = "http://localhost:8000"
    TOKEN = ""

    @classmethod
    def setUpClass(cls):
        cls.client = Client()

        teacher = User.objects.create_user(
            username="course_join_test_teacher", password="course_join_test_teacher"
        )
        teacher.save()

        student = User.objects.create_user(
            username="course_join_test_student", password="course_join_test_student"
        )
        student.save()

        # Log in as teacher
        response = cls.client.post(
            cls.BASE_URL + "/api/auth/token/",
            {
                "username": "course_join_test_teacher",
                "password": "course_join_test_teacher",
            },
            format="json",
        )
        cls.TOKEN = response.data["access"]

        super(CourseJoinTest, cls).setUpClass()

    def test_join_course(self):

        teacher = User.objects.get(username="course_join_test_teacher")

        course = Course.objects.create(
            title="testcourse", description="testdescription", join_code="12345678"
        )
        course.owners.add(teacher)
        course.save()

        # Log in as student
        response = self.client.post(
            self.BASE_URL + "/api/auth/token/",
            {
                "username": "course_join_test_student",
                "password": "course_join_test_student",
            },
            format="json",
        )
        self.TOKEN = response.data["access"]

        endpoint = self.BASE_URL + "/api/course_join/"
        response = self.client.post(
            endpoint,
            {"join_code": "12345678"},
            content_type="application/json",
            **{"HTTP_AUTHORIZATION": f"Bearer {self.TOKEN}"},
        )

        # check if student is in course
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["course_id"], course.id)
