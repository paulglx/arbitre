from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from api.models import StudentGroup, Course, User
from ..serializers import StudentGroupSerializer, CourseSerializer


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
