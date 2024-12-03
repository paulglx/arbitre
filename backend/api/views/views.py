from django.db.models.query import Prefetch
from ..models import Course, Session, Exercise, StudentGroup
from ..serializers import (
    CourseSerializer,
    ExerciseSerializer,
    SessionSerializer,
    StudentGroupSerializer,
)
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Q
from django.http import HttpRequest
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework.response import Response
from runner.models import Submission
from runner.serializers import SubmissionSerializer
from runner.serializers import TestResultSerializer
import os


class IsCourseOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        return (
            request.user in obj.course.owners.all()
            or request.user in obj.course.tutors.all()
        )


class HasSessionStarted(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if obj.start_date is None:
            return True
        return obj.start_date < timezone.now()


class SessionViewSet(viewsets.ModelViewSet):
    """
    Manage sessions.

    List all sessions (GET), or create a new session (POST).

    body : {
        course_id: 1,
        title: "Session 1",
        description: "This is the first session"
    }
    """

    serializer_class = SessionSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            permission_classes = [permissions.IsAuthenticated, IsCourseOwner]
        elif self.action in ["list", "retrieve"]:
            permission_classes = [
                permissions.IsAuthenticated,
                HasSessionStarted | IsCourseOwner,
            ]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    # Return sessions of course if course_id param passed. Else, return all sessions
    def get_queryset(self):
        course_id = self.request.query_params.get("course_id")

        if course_id:
            # If owner, return all sessions
            course = Course.objects.prefetch_related("session_set").get(id=course_id)
            if (
                self.request.user in course.owners.all()
                or self.request.user in course.tutors.all()
            ):
                return course.session_set.all()
            # Else, return all sessions. If a session does have a start date, return only sessions that have started
            else:
                return Session.objects.filter(
                    Q(course_id=course_id)
                    & (Q(start_date__isnull=True) | Q(start_date__lt=timezone.now()))
                )
        else:
            return Session.objects.all()


class ExerciseViewSet(viewsets.ModelViewSet):
    """
    List all exercises (GET), or create a new exercise (POST).
    """

    serializer_class = ExerciseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    # Return exercises of session if course_id param passed. Else, return all sessions
    def get_queryset(self):
        session_id = self.request.query_params.get("session_id")

        response = []

        if session_id:
            response = Exercise.objects.filter(session_id=session_id)
        else:
            response = Exercise.objects.all()

        return response


class ExerciseTeacherFilesViewSet(viewsets.ViewSet):
    """
    Get the teacher_files ZIP file of an exercise.
    Returns the ZIP file in base64 format by default.
    If base64 is set to false, returns the ZIP file as a file.

    Params:
    - exercise_id : number
    """

    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated | HasAPIKey]

    def list(self, request):
        import base64

        exercise_id = self.request.query_params.get("exercise_id")

        exercise = Exercise.objects.get(id=exercise_id)

        teacher_files_zip = exercise.teacher_files

        # Check if the file exists
        if not os.path.exists(teacher_files_zip.path):
            return Response(
                {"message": "The teacher files cannot be found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        teacher_files_zip_to_base64 = base64.b64encode(teacher_files_zip.read())
        teacher_files_zip.close()

        return Response(teacher_files_zip_to_base64)


class StudentGroupViewSet(viewsets.ModelViewSet):
    """
    Manage Student Groups.

    Set the whole student group at once.

    GET all student groups of a course (GET)
    params :
    - course_id : id of the course (number)
    """

    serializer_class = StudentGroupSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        course_id = self.request.query_params.get("course_id", None)
        if course_id:
            return StudentGroup.objects.filter(course=course_id)
        else:
            return StudentGroup.objects.all()

    def create(self, request, *args, **kwargs):
        course = Course.objects.get(id=request.data.get("course"))

        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )

        student_group = super().create(request, *args, **kwargs)

        return Response(
            {
                "message": "Student group created",
                "student_group": student_group.data,
                "course": CourseSerializer(course).data,
            },
            status=status.HTTP_200_OK,
        )

    def update(self, request, *args, **kwargs):
        course = self.get_object().course
        user = request.user

        if user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )

        student_group = super().update(request, *args, **kwargs)

        return Response(
            {
                "message": "Student group updated",
                "student_group": student_group.data,
                "course": CourseSerializer(course).data,
            },
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        course = self.get_object().course

        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )

        super().destroy(request, *args, **kwargs)

        return Response(
            {
                "message": "Student group deleted",
                "course": CourseSerializer(course).data,
            },
            status=status.HTTP_200_OK,
        )


class SetStudentGroupViewSet(viewsets.ViewSet):
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request):
        student = User.objects.get(id=request.data.get("user_id"))
        student_group = StudentGroup.objects.get(id=request.data.get("student_group"))
        course = student_group.course

        if request.user not in course.owners.all():
            return Response(
                {"message": "Forbidden: User is not an owner"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if student not in course.students.all():
            return Response(
                {"message": "Forbidden: User is not a student of the course"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Remove student from previous group
        previous_group = StudentGroup.objects.filter(
            students__in=[student], course=course
        ).first()
        if previous_group:
            previous_group.students.remove(student)
            previous_group.save()

        # Add student to new group
        student_group.students.add(student)
        student_group.save()

        return Response(
            {
                "message": "Student added to group",
                "course": CourseSerializer(course).data,
            },
            status=status.HTTP_200_OK,
        )


class CoursesSessionsExercisesViewSet(viewsets.ViewSet):
    """
    Return all courses, sessions and exercises.

    GET : Get all courses, sessions and exercises of current user
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        user = request.user

        courses = (
            Course.objects.filter(Q(tutors=user) | Q(owners=user))
            .prefetch_related(
                # Prefetch sessions with their exercises
                Prefetch(
                    "session_set",
                    queryset=Session.objects.prefetch_related(
                        # Prefetch exercises with specific fields
                        Prefetch(
                            "exercise_set",
                            queryset=Exercise.objects.only("id", "title", "session_id"),
                        )
                    ).only("id", "title", "course_id"),
                ),
                # Prefetch student groups
                Prefetch(
                    "studentgroup_set",
                    queryset=StudentGroup.objects.only(
                        "id", "name", "course_id"
                    ).prefetch_related(
                        Prefetch(
                            "students", queryset=User.objects.only("id", "username")
                        )
                    ),
                ),
            )
            .distinct()
        )

        courses_data = [
            {
                "id": course.id,
                "title": course.title,
                "sessions": [
                    {
                        "id": session.id,
                        "title": session.title,
                        "exercises": [
                            {
                                "id": exercise.id,
                                "title": exercise.title,
                            }
                            for exercise in session.exercise_set.all()
                        ],
                    }
                    for session in course.session_set.all()
                ],
                "student_groups": [
                    {
                        "id": group.id,
                        "name": group.name,
                        "students": [
                            {"id": student.id, "username": student.username}
                            for student in group.students.all()
                        ],
                    }
                    for group in course.studentgroup_set.all()
                ],
            }
            for course in courses
        ]

        return Response(courses_data)


class ResultsOfSessionViewSet(viewsets.ViewSet):
    """
    Get results of a session.

    Get submission statuses for all exercises of a session, for a given user.
    Params:
    - user_id : number
    - session_id : number
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        user_id = request.data.get("user_id")
        session_id = request.data.get("session_id")

        # Get all the exercises of the session
        exercises = Exercise.objects.filter(session_id=session_id).select_related(
            "session"
        )

        # Get all the submissions of the user for the session
        submissions = (
            Submission.objects.filter(exercise__session_id=session_id, owner_id=user_id)
            .select_related("exercise", "exercise__session")
            .prefetch_related("testresult_set", "exercise__test_set")
            .annotate(
                late=models.Case(
                    models.When(
                        created__gt=models.F("exercise__session__deadline"),
                        then=True,
                    ),
                    default=False,
                    output_field=models.BooleanField(),
                )
            )
        )

        # Put this query in a dict
        submissions_dict = {sub.exercise_id: sub for sub in submissions}

        results = [
            {
                "exercise_id": exercise.id,
                "exercise_title": exercise.title,
                "status": submissions_dict[exercise.id].status
                if exercise.id in submissions_dict
                else "not submitted",
                "grade": submissions_dict[exercise.id].grade
                if exercise.id in submissions_dict
                else None,
                "late": submissions_dict[exercise.id].late
                if exercise.id in submissions_dict
                else False,
            }
            for exercise in exercises
        ]

        return Response(results)


class AllResultsOfSessionViewSet(viewsets.ViewSet):
    """
    Get results of a session.

    Get submission statuses for all exercises of a session, for all students.
    Params:
    - session_id :  number
    - groups :      array (?groups=1,2,3) (optional)

    Used to create a table of results for a session.
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        session_id = self.request.GET.get("session_id")
        group_ids = (
            self.request.GET.get("groups", "").split(",")
            if "groups" in self.request.GET
            else []
        )

        session = (
            Session.objects.select_related("course")
            .prefetch_related(
                Prefetch(
                    "course__studentgroup_set",
                    queryset=StudentGroup.objects.filter(id__in=group_ids)
                    if group_ids and group_ids[0]
                    else StudentGroup.objects.all(),
                    to_attr="filtered_groups",
                ),
                "course__students",
            )
            .get(id=session_id)
        )

        if group_ids and group_ids[0]:
            students = User.objects.filter(
                studentgroup__students__in=session.filtered_groups
            ).distinct()
        else:
            students = session.course.students.all()

        exercises = Exercise.objects.filter(session_id=session_id)

        # Fetch all submissions in one query
        submissions = (
            Submission.objects.filter(
                exercise__session_id=session_id, owner__in=students
            )
            .select_related("owner", "exercise")
            .prefetch_related("testresult_set")
            .annotate(
                late=models.Case(
                    models.When(
                        created__gt=models.F("exercise__session__deadline"),
                        then=True,
                    ),
                    default=False,
                    output_field=models.BooleanField(),
                )
            )
        )

        # Lookup dictionary for submissions
        submission_lookup = {
            (sub.owner_id, sub.exercise_id): sub for sub in submissions
        }

        students_data = []
        for student in students:
            exercises_data = [
                {
                    "exercise_id": exercise.id,
                    "exercise_title": exercise.title,
                    "status": submission_lookup.get(
                        (student.id, exercise.id), {}
                    ).status
                    if (student.id, exercise.id) in submission_lookup
                    else "not submitted",
                    "grade": submission_lookup.get((student.id, exercise.id), {}).grade
                    if (student.id, exercise.id) in submission_lookup
                    else None,
                    "late": submission_lookup.get((student.id, exercise.id), {}).late
                    if (student.id, exercise.id) in submission_lookup
                    else False,
                }
                for exercise in exercises
            ]

            students_data.append(
                {
                    "user_id": student.id,
                    "username": student.username,
                    "exercises": exercises_data,
                }
            )

        return Response(students_data)


class AllResultsViewSet(viewsets.ViewSet):
    """
    Get all results of a teacher's courses.

    Get submission statuses for all exercises for all students of all user's courses.
    User : logged in user

    Used to create a table of results for all courses.
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
