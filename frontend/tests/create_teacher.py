from django.contrib.auth.models import User

if User.objects.filter(username='teacher') == []:  
    user = User.objects.create_user('testteacher','testmail@test.com', 'testpassword')
    user.groups.add(2)
    user.save()
    exit()