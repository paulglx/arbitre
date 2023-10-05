import json

from django.contrib.auth.models import User
from django.db.models import Q
from django.http import HttpRequest
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from runner.models import Exercise, Submission, TestResult
from runner.serializers import SubmissionSerializer, TestResultSerializer

from ..models import Course, Session, StudentGroup
from ..serializers import MinimalExerciseSerializer


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

            # Get status for exercise tests
            testResults = TestResult.objects.filter(
                submission__owner=user, submission__exercise_id=exercise["id"]
            )
            testResults_serializer = TestResultSerializer(testResults, many=True)

            results.append(
                {
                    "exercise_id": exercise["id"],
                    "exercise_title": exercise["title"],
                    "status": status,
                    "testResults": testResults_serializer.data,
                }
            )

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
        session = Session.objects.get(id=self.request.GET.get("session_id"))

        if "groups" in self.request.GET and self.request.GET.get("groups") != "":
            groups = []
            for group_id in self.request.GET.get("groups").split(","):
                group = StudentGroup.objects.get(id=group_id)
                groups.append(group)

            # Check if the groups exist and belong to the course
            for group in groups:
                if (
                    group not in StudentGroup.objects.all()
                    or group.course != session.course
                ):
                    return Response(
                        {"message": "NOT FOUND: Group not found or not in course"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

            students = []
            for group in groups:
                for student in group.students.all():
                    students.append(student)

        else:
            students = session.course.students.all()
        students_ids = [student.id for student in students]

        students_data = []
        for student_id in students_ids:
            result_request = HttpRequest()
            result_request.method = "GET"
            result_request.data = {
                "user_id": student_id,
                "session_id": session.id,
            }

            result_response = ResultsOfSessionViewSet.list(self, result_request).data

            try:
                student_group = StudentGroup.objects.get(
                    students__in=[student_id], course=session.course
                ).id
            except StudentGroup.DoesNotExist:
                student_group = None

            students_data.append(
                {
                    "user_id": student_id,
                    "username": User.objects.get(id=student_id).username,
                    "group": student_group,
                    "exercises": result_response,
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
