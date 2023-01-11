from .models import Course, Session, Exercise
from .serializers import (
    CourseSerializer,
    SessionSerializer,
    ExerciseSerializer,
    MinimalExerciseSerializer,
)
from django.contrib.auth.models import User
from django.db.models import Q
from django.http import HttpRequest
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from runner.models import Submission
from runner.serializers import SubmissionSerializer
import json
import secrets
import string


class CourseViewSet(viewsets.ModelViewSet):
    """
    List all courses of student, or courses created by teacher (GET)
    Create a new course (POST)
    """

    serializer_class = CourseSerializer
    permission_classes = (permissions.AllowAny,)

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

    # Add current user to owners
    def perform_create(self, serializer):
        serializer.save(owners=[self.request.user], join_code=self.generate_join_code())


class CourseJoinViewSet(viewsets.ViewSet):
    """
    Join a course with a join code
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
    Refresh course code
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


class CoursesSessionsExercisesViewSet(viewsets.ViewSet):
    """
    List all courses of user, including sessions and exercises (GET)
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        user = request.user

        courses = Course.objects.filter(
            Q(tutors__in=[user]) | Q(owners__in=[user])
        ).distinct()

        courses_data = []
        for course in courses:

            sessions = Session.objects.filter(course=course)
            sessions_data = []
            for session in sessions:

                exercises = Exercise.objects.filter(session=session)
                exercises_data = []
                for exercise in exercises:
                    exercises_data.append(
                        {
                            "id": exercise.id,
                            "title": exercise.title,
                        }
                    )

                sessions_data.append(
                    {
                        "id": session.id,
                        "title": session.title,
                        "exercises": exercises_data,
                    }
                )

            courses_data.append(
                {
                    "id": course.id,
                    "title": course.title,
                    "sessions": sessions_data,
                }
            )

        return Response(courses_data)


class CourseOwnerViewSet(viewsets.ViewSet):
    """
    List (GET), add (POST) or remove (DELETE) teachers from a course
    - course_id: number
    - user_id: number
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        course = Course.objects.get(pk=request.query_params.get("course_id"))
        return Response(
            {
                "owners": [
                    {"id": user.id, "username": user.username}
                    for user in course.owners.all()
                ]
            }
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
    List (GET), add (POST) or remove (DELETE) tutors from a course.
    - course_id: number
    - user_id: number
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        course = Course.objects.get(pk=request.query_params.get("course_id"))
        return Response(
            {
                "tutors": [
                    {"id": user.id, "username": user.username}
                    for user in course.tutors.all()
                ]
            }
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
    List (GET), add (POST) or remove (DELETE) students from a course
    - course_id: number
    - user_id: number
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        course = Course.objects.get(pk=request.query_params.get("course_id"))
        return Response(
            {
                "students": [
                    {"id": user.id, "username": user.username}
                    for user in course.students.all()
                ]
            }
        )

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
                {"message": "Student added to course"}, status=status.HTTP_200_OK
            )

    def destroy(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )
        user = User.objects.get(id=request.data.get("user_id"))
        if user in course.students.all():
            course.students.remove(user)
            course.save()
            return Response(
                {"message": "Student removed from course"}, status=status.HTTP_200_OK
            )

        else:
            return Response(
                {"message": "User is not a student"}, status=status.HTTP_404_NOT_FOUND
            )


class SessionViewSet(viewsets.ModelViewSet):
    """
    List all sessions (GET), or create a new session (POST).
    """

    serializer_class = SessionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    # Return sessions of course if course_id param passed. Else, return all sessions
    def get_queryset(self):
        course_id = self.request.query_params.get("course_id")
        if course_id:
            return Session.objects.filter(course_id=course_id)
        else:
            return Session.objects.all()


class ExerciseViewSet(viewsets.ModelViewSet):
    """
    List all exercises (GET), or create a new exercise (POST).
    """

    serializer_class = ExerciseSerializer
    permission_classes = (permissions.AllowAny,)

    # Return exercises of session if course_id param passed. Else, return all sessions
    def get_queryset(self):
        session_id = self.request.query_params.get("session_id")
        if session_id:
            return Exercise.objects.filter(session_id=session_id)
        else:
            return Exercise.objects.all()


class ResultsOfSessionViewSet(viewsets.ViewSet):
    """
    Get submission statuses for all exercises of a session, for a given user.
    Params: user_id, session_id
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):

        user = User.objects.get(id=request.data["user_id"])
        session = Session.objects.get(id=request.data["session_id"])

        # Get all the exercises to do in the session
        exercises = Exercise.objects.filter(session=session)
        exercises_to_do = MinimalExerciseSerializer(instance=exercises, many=True)
        exercises_to_do_dict = json.loads(json.dumps(exercises_to_do.data))

        # Get status for exercises that have been submitted
        submissions = Submission.objects.filter(owner=user, exercise__in=exercises)
        submissions_serializer = SubmissionSerializer(submissions, many=True)

        # Return exercise and status only
        results = []
        for exercise in exercises_to_do_dict:
            status = "not submitted"
            for submission in submissions_serializer.data:
                if submission["exercise"] == exercise["id"]:
                    status = submission["status"]
            results.append(
                {
                    "exercise_id": exercise["id"],
                    "exercise_title": exercise["title"],
                    "status": status,
                }
            )

        return Response(results)


class AllResultsOfSessionViewSet(viewsets.ViewSet):
    """
    Get submission statuses for all exercises of a session, for all students.
    Params: session_id
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):

        session = Session.objects.get(id=self.request.GET.get("session_id"))

        all_students = session.course.students.all()
        all_students_ids = [student.id for student in all_students]

        students_data = []
        for student_id in all_students_ids:

            result_request = HttpRequest()
            result_request.method = "GET"
            result_request.data = {
                "user_id": student_id,
                "session_id": session.id,
            }

            result_response = ResultsOfSessionViewSet.list(self, result_request).data

            students_data.append(
                {
                    "user_id": student_id,
                    "username": User.objects.get(id=student_id).username,
                    "exercises": result_response,
                }
            )

        return Response(students_data)


class AllResultsViewSet(viewsets.ViewSet):
    """
    Get submission statuses for all exercises for all students of all user's courses.
    User : logged in user
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        user = self.request.user
        courses = Course.objects.filter(
            Q(owners__in=[user]) | Q(tutors__in=[user])
        ).distinct()

        courses_to_send = []

        for course in courses:

            all_students = course.students.all()
            all_students_ids = [student.id for student in all_students]

            session_data = []

            for session in course.session_set.all():

                students_data = []
                for student_id in all_students_ids:

                    result_request = HttpRequest()
                    result_request.method = "GET"
                    result_request.data = {
                        "user_id": student_id,
                        "session_id": session.id,
                    }

                    result_response = ResultsOfSessionViewSet.list(
                        self, result_request
                    ).data

                    students_data.append(
                        {
                            "student_id": student_id,
                            "student_name": User.objects.get(id=student_id).username,
                            "results": result_response,
                        }
                    )

                session_data.append(
                    {
                        "session_id": session.id,
                        "session_title": session.title,
                        "students_data": students_data,
                    }
                )

            courses_to_send.append(
                {
                    "course_id": course.id,
                    "course_title": course.title,
                    "sessions": session_data,
                }
            )

        return Response({"courses": courses_to_send})
