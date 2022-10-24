from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


# Create your tests here.
class UserTest(TestCase):
    """
    Test User interactions
    """

    def setUp(self):
        user = User.objects.create_user("testuser", "test@test.tst", "testpwd")
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