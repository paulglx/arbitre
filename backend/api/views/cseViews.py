from ..models import Course, Session, Exercise, StudentGroup
from ..serializers import StudentGroupSerializer
from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.response import Response


class CoursesSessionsExercisesViewSet(viewsets.ViewSet):
    """
    Return all courses, sessions and exercises.

    GET : Get all courses, sessions and exercises of current user
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
                    "student_groups": StudentGroupSerializer(
                        StudentGroup.objects.filter(course=course), many=True
                    ).data,
                }
            )

        return Response(courses_data)
