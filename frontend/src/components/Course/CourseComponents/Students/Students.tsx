import StudentGroups from "./StudentGroups/StudentGroups";
import StudentsInvite from "./StudentsInvite";
import StudentsList from "./StudentsList/StudentsList";
import { useGetCourseStudentGroupsQuery } from "../../../../features/courses/studentGroupApiSlice";

const Students = ({ course, refetch }: { course: any, refetch: any }) => {

  const { data: groups, refetch: refetchGroups } =
    useGetCourseStudentGroupsQuery(
      { course_id: course?.id },
      {
        skip: !course?.id,
      }
    );

  return (
    <>
      <StudentsInvite course={course} />
      <br />
      <StudentGroups
        course={course}
        refetch={refetch}
        refetchGroups={refetchGroups}
        groups={groups}
      />
      <StudentsList
        course={course}
        refetch={refetch}
        groups={groups}
        refetchGroups={refetchGroups}
      />
    </>
  );
};

export default Students;
