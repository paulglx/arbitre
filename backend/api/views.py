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
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from runner.models import Submission
from runner.serializers import SubmissionSerializer
import json


class CourseViewSet(viewsets.ModelViewSet):
    """
    List all courses of student, or courses created by teacher (GET)
    Create a new course (POST)
    """

    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    # Allow students or owners to get their courses
    def get_queryset(self):
        user = self.request.user
        return Course.objects.filter(
            Q(students__in=[user]) | Q(owners__in=[user])
        ).distinct()

    # Add current user to owners
    def perform_create(self, serializer):
        serializer.save(owners=[self.request.user])


class CourseOwnerViewSet(viewsets.ViewSet):
    """
    List (GET), add (POST) or remove (DELETE) teachers from a course
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
        user = User.objects.get(id=request.data.get("user_id"))
        course.owners.add(user)
        course.save()
        return Response({"status": "OK"})

    def destroy(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        user = User.objects.get(id=request.data.get("user_id"))
        course.owners.remove(user)
        course.save()
        return Response({"status": "OK"})


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
    permission_classes = (permissions.IsAuthenticated,)

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
        submissions = Submission.objects.filter(
            owners__in=[user], exercise__in=exercises
        )
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


class AllResultsViewSet(viewsets.ViewSet):
    """
    Get submission statuses for all exercises for all students of all user's courses.
    User : logged in user
    """

    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request):
        user = self.request.user
        courses = Course.objects.filter(Q(owners__in=[user])).distinct()

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
