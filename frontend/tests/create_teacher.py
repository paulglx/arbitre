from django.contrib.auth.models import User

user, created = User.objects.get_or_create(
    username="testteacher", email="testmail@test.com"
)
if created:
    user.set_password("testpassword")
    user.groups.add(2)
    user.save()

exit()
