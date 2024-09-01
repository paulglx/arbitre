import {
  useAddStudentGroupMutation,
  useRemoveStudentGroupMutation,
} from "../../../../../features/courses/studentGroupApiSlice";

import EditableName from "./EditableName";
import { pushNotification } from "../../../../../features/notification/notificationSlice";
import { useDispatch } from "react-redux";
import { useMemo } from "react";

const StudentGroupList = (props: any) => {
  const course = props.course;
  const refetchGroups = props.refetchGroups;
  const groups = props.groups;

  const sortedGroups = useMemo(() => {
    const groupsToSort = structuredClone(groups);
    if (groupsToSort) {
      return groupsToSort.sort((a: any, b: any) => {
        return a.id - b.id;
      });
    }
  }, [groups]);

  const dispatch = useDispatch();

  const [addStudentGroup] = useAddStudentGroupMutation();
  const [removeStudentGroup] = useRemoveStudentGroupMutation();

  const handleAddStudentGroup = async () => {
    await addStudentGroup({
      course: course.id,
      name: `Group ${groups.length + 1}`,
    })
      .unwrap()
      .catch((e) => {
        dispatch(
          pushNotification({
            message: "Unable to add student group.",
            type: "error",
          }),
        );
      })
      .then(() => {
        refetchGroups();
      });
  };

  const handleRemoveStudentGroup = async (group: any) => {
    await removeStudentGroup({
      id: group.id,
    })
      .unwrap()
      .catch((e) => {
        dispatch(
          pushNotification({
            message: "Unable to remove student group.",
            type: "error",
          }),
        );
      })
      .then(() => {
        refetchGroups();
      });
  };

  return (
    <div className="flex flex-col w-full lg:w-1/2">
      {sortedGroups?.map((group: any, i: number) => {
        return (
          <div className="flex flex-row items-center justify-between" key={i}>
            <div className="flex flex-row items-center justify-start">
              <span className="text-gray-400 text-sm w-4">{i + 1}</span>
              <EditableName group={group} refetch={refetchGroups} />
            </div>
            <button
              className="border rounded-md bg-gray-50 hover:bg-gray-100 text-sm px-1"
              onClick={() => handleRemoveStudentGroup(group)}
            >
              Remove
            </button>
          </div>
        );
      })}
      <button
        className="border rounded-lg text-left bg-gray-50 hover:bg-gray-100 px-2 py-1 text-sm mt-1"
        onClick={handleAddStudentGroup}
      >
        Add group
      </button>
    </div>
  );
};

export default StudentGroupList;
