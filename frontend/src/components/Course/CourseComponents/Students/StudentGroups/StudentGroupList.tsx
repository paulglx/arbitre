import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
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
  };

  return (
    <div className="flex flex-col w-full lg:w-1/2">
      {sortedGroups?.map((group: any, i: number) => {
        return (
          <div className="flex flex-row items-center group" key={i}>
            <div className="flex flex-row items-center justify-start">
              <span className="text-gray-400 text-sm w-4">{i + 1}</span>
              <EditableName group={group} />
            </div>
            <button
              className="hidden group-hover:flex items-center gap-1 rounded-md bg-gray-50 hover:bg-gray-100 text-xs px-1 py-1 ms-4 text-gray-600"
              onClick={() => handleRemoveStudentGroup(group)}
            >
              <TrashIcon className="size-3" />
              Remove
            </button>
          </div>
        );
      })}
      <button
        className="flex items-center w-fit gap-1 hover:underline text-sm mt-1 text-blue-500"
        onClick={handleAddStudentGroup}
      >
        <PlusIcon className="size-3" />
        Add group
      </button>
    </div>
  );
};

export default StudentGroupList;
