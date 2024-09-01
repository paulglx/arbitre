from api.models import Course, StudentGroup, Session, Exercise
from runner.models import Test
from api.serializers import CourseSerializer
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
import secrets
import string


class IsCourseOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        return request.user in obj.owners.all()


class CourseViewSet(viewsets.ModelViewSet):
    """
    Manage courses.

    GET all courses :
    /api/course?all=true

    Get all courses of student, or courses created by teacher (GET)
    Create a new course (POST)
    /api/course
    """

    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsCourseOwner]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def generate_join_code(self):
        alphabet = string.ascii_uppercase + string.digits

        join_code = "".join(secrets.choice(alphabet) for i in range(8))
        while Course.objects.filter(join_code=join_code).exists():
            join_code = "".join(secrets.choice(alphabet) for i in range(8))

        return join_code

    # Allow students, tutors or owners to get their courses
    def get_queryset(self):
        # if param 'all' is set, return all courses
        if self.request.query_params.get("all", None) == "true":
            return Course.objects.all()

        user = self.request.user
        return Course.objects.filter(
            Q(students__in=[user]) | Q(tutors__in=[user]) | Q(owners__in=[user])
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(owners=[self.request.user], join_code=self.generate_join_code())


class CourseJoinViewSet(viewsets.ViewSet):
    """
    Join a course with a join code.

    POST : Join a course with a join code
    body : {
        "join_code": "XXXXXXX"
    }
    """

    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request):
        courses = Course.objects.filter(join_code=request.data.get("join_code"))
        if not courses.exists():
            return Response(
                {"message": "Course not found"}, status=status.HTTP_404_NOT_FOUND
            )
        course = courses[0]
        if not course.join_code_enabled:
            return Response(
                {"message": "Join code is disabled"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if request.user in course.students.all():
            return Response(
                {"message": "You are already in this course", "course_id": course.id},
                status=status.HTTP_400_BAD_REQUEST,
            )
        course.students.add(request.user)
        course.save()
        return Response(
            {
                "message": "Success",
                "course_id": course.id,
            },
            status=status.HTTP_200_OK,
        )


class CourseJoinCodeEnabledViewSet(viewsets.ViewSet):
    """
    Manage join code.

    POST : Enable or disable join code
    body : {
        "course_id": 1,
        "enabled": true
    }
    """

    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request):
        course = Course.objects.get(pk=request.data.get("course_id"))
        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )
        course.join_code_enabled = request.data.get("enabled")
        if not isinstance(course.join_code_enabled, bool):
            return Response(
                {"message": "join_code_enabled must be a boolean"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        course.save()
        return Response(
            {
                "message": "Success",
                "course_id": course.id,
                "join_code_enabled": course.join_code_enabled,
            },
            status=status.HTTP_200_OK,
        )


class CourseRefreshCodeViewSet(viewsets.ViewSet):
    """
    Refresh join code.

    POST : Refresh join code
    body : {
        "course_id": 1
    }
    """

    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request):
        course = Course.objects.get(pk=request.data.get("course_id"))
        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )
        course.join_code = CourseViewSet.generate_join_code(self)
        course.save()
        return Response(
            {
                "message": "Success",
                "course_id": course.id,
                "join_code": course.join_code,
            },
            status=status.HTTP_200_OK,
        )


class CourseOwnerViewSet(viewsets.ViewSet):
    """
    Manage course owners.

    List (GET), add (POST) or remove (DELETE) owners from a course
    body : {
        course_id: 1,
        user_id: 1, //user to make an owner
    }
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        course = Course.objects.get(pk=request.query_params.get("course_id"))
        return Response(
            [{"id": user.id, "username": user.username} for user in course.owners.all()]
        )

    def create(self, request):
        course = Course.objects.get(pk=request.data.get("course_id"))
        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )
        user = User.objects.get(id=request.data.get("user_id"))
        if user in course.tutors.all():
            return Response(
                {"message": "User is already a tutor of this course"},
                status=status.HTTP_409_CONFLICT,
            )
        if user not in course.owners.all():
            course.owners.add(user)
            course.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "User is already an owner"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def destroy(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )
        user = User.objects.get(id=request.data.get("user_id"))
        if user in course.owners.all():
            course.owners.remove(user)
            course.save()
            return Response(
                {"message": "Owner removed from course"}, status=status.HTTP_200_OK
            )

        else:
            return Response(
                {"message": "User is not an owner"}, status=status.HTTP_404_NOT_FOUND
            )


class CourseTutorViewSet(viewsets.ViewSet):
    """
    Manage course tutors.

    List (GET), add (POST) or remove (DELETE) tutors from a course
    body : {
        course_id: 1,
        user_id: 1, //user to make a tutor
    }
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        course = Course.objects.get(pk=request.query_params.get("course_id"))
        return Response(
            [{"id": user.id, "username": user.username} for user in course.tutors.all()]
        )

    def create(self, request):
        course = Course.objects.get(pk=request.data.get("course_id"))
        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )
        user = User.objects.get(id=request.data.get("user_id"))
        if user in course.owners.all():
            return Response(
                {
                    "message": "Unchanged: User is an owner of this course",
                },
                status=status.HTTP_409_CONFLICT,
            )
        if user not in course.tutors.all():
            course.tutors.add(user)
            course.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "User is already a tutor"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def destroy(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )
        user = User.objects.get(id=request.data.get("user_id"))
        if user in course.tutors.all():
            course.tutors.remove(user)
            course.save()
            return Response(
                {"message": "Tutor removed from course"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "User is not a tutor"}, status=status.HTTP_404_NOT_FOUND
            )


class CourseStudentViewSet(viewsets.ViewSet):
    """
    Manage course students.

    List (GET), add (POST) or remove (DELETE) students from a course
    body : {
        course_id: 1,
        user_id: 1, //user to make a student
    }
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        course = Course.objects.get(pk=request.query_params.get("course_id"))

        students = []

        for user in course.students.all():
            student_group = StudentGroup.objects.filter(
                students__in=[user], course=course
            ).first()
            if student_group:
                user.student_group = {
                    "name": student_group.name,
                    "id": student_group.id,
                }
            else:
                user.student_group = None
            students.append(
                {
                    "id": user.id,
                    "username": user.username,
                    "student_group": user.student_group,
                }
            )

        return Response(students)

    def create(self, request):
        course = Course.objects.get(pk=request.data.get("course_id"))
        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner of this course"},
                status=status.HTTP_403_FORBIDDEN,
            )
        user = User.objects.get(id=request.data.get("user_id"))
        if user in course.students.all():
            return Response(
                {"message": "User is already a student of this course"},
                status=status.HTTP_409_CONFLICT,
            )
        else:
            course.students.add(user)
            course.save()
            return Response(
                {
                    "message": "Student added to course",
                    "course": CourseSerializer(course).data,
                },
                status=status.HTTP_200_OK,
            )

    def destroy(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )
        user = User.objects.get(id=request.data.get("user_id"))

        # Remove student from student group
        student_group = StudentGroup.objects.filter(
            students__in=[user], course=course
        ).first()
        if student_group:
            student_group.students.remove(user)
            student_group.save()

        if user in course.students.all():
            course.students.remove(user)
            course.save()
            return Response(
                {
                    "message": "Student removed from course",
                    "course": CourseSerializer(course).data,
                },
                status=status.HTTP_200_OK,
            )

        else:
            return Response(
                {"message": "User is not a student"}, status=status.HTTP_404_NOT_FOUND
            )


class CourseCloneViewSet(viewsets.ViewSet):
    # Check if user is an owner of the course
    # Create a new course with same title, description, no students
    # Create groups to match the original course
    # For session in course:
    #   Create new_sess in new_course
    #   For exercise in session:
    #       Create new_exercise in new_session
    #           For test in exercise:
    #               Create new_test in new_exercise

    permission_classes = [IsCourseOwner]

    def create(self, request):
        try:
            course = Course.objects.get(pk=request.data.get("course_id"))
        except Course.DoesNotExist:
            return Response(
                {
                    "message": "This course does not exist",
                    "new_course_id": None,
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if not request.user in course.owners.all():
            return Response(
                {
                    "message": "You are not an owner of this course",
                    "new_course_id": None,
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Create new course
        new_course = Course.objects.create(
            title=course.title + " (clone)",
            description=course.description,
            language=course.language,
            join_code_enabled=course.join_code_enabled,
            join_code=CourseViewSet.generate_join_code(self),
            groups_enabled=course.groups_enabled,
            auto_groups_enabled=course.auto_groups_enabled,
            late_penalty=course.late_penalty,
        )

        new_course.owners.add(request.user)
        new_course.save()

        # Clone student groups, with no students
        student_groups = StudentGroup.objects.filter(course=course)
        for student_group in student_groups:
            new_student_group = StudentGroup.objects.create(
                name=student_group.name, course=new_course
            )
            new_student_group.save()

        # Clone sessions
        for session in course.session_set.all():
            new_session = Session.objects.create(
                course=new_course,
                title=session.title,
                description=session.description,
                grade=session.grade,
                deadline_type=session.deadline_type,
            )
            new_session.save()

            # Clone exercises
            for exercise in session.exercise_set.all():
                new_exercise = Exercise.objects.create(
                    session=new_session,
                    type=exercise.type,
                    title=exercise.title,
                    description=exercise.description,
                    grade=exercise.grade,
                    prefix=exercise.prefix,
                    suffix=exercise.suffix,
                    teacher_files=exercise.teacher_files,
                )
                new_exercise.save()

                # Clone tests
                for test in exercise.test_set.all():
                    new_test = Test.objects.create(
                        exercise=new_exercise,
                        name=test.name,
                        stdin=test.stdin,
                        stdout=test.stdout,
                        coefficient=test.coefficient,
                    )
                    new_test.save()

        return Response(
            {
                "message": "Course cloned",
                "new_course_id": new_course.id,
            },
            status=status.HTTP_200_OK,
        )
