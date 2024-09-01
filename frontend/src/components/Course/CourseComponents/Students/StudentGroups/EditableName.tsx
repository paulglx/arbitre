import { pushNotification } from "../../../../../features/notification/notificationSlice";
import { useChangeStudentGroupMutation } from "../../../../../features/courses/studentGroupApiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

const EditableName = (props: any) => {
  const group = props.group;

  const [name, setName] = useState<string>(props.group.name);
  const [edit, setEdit] = useState<boolean>(false);
  const [formerName, setFormerName] = useState<string>("");

  const dispatch = useDispatch();

  const [changeStudentGroupName] = useChangeStudentGroupMutation();

  const handleSetStudentGroupName = async () => {
    if (name === formerName) return;

    await changeStudentGroupName({
      id: group.id,
      name: name,
    })
      .unwrap()
      .catch((e) => {
        dispatch(
          pushNotification({
            message: "Unable to change student group name.",
            type: "error",
          }),
        );
      })
      .then((res) => {
        if (res.course) {
          dispatch(
            pushNotification({
              message: "Group name changed successfully",
              type: "success",
            }),
          );
        }
      });
  };

  return (
    <>
      {edit ? (
        <input
          className="rounded-md border border-gray-300 w-auto p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          type="text"
          value={name}
          aria-label="Group name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={() => {
            handleSetStudentGroupName();
            setEdit(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSetStudentGroupName();
              setEdit(false);
            }
            if (e.key === "Escape") {
              setName(formerName);
              setEdit(false);
            }
          }}
          autoFocus
        />
      ) : (
        <span
          className="text-gray-600 rounded-md p-1 text-sm cursor-pointer hover:text-gray-800 hover:bg-gray-100"
          onFocus={() => {
            setFormerName(group.name);
            setEdit(true);
          }}
          tabIndex={0}
        >
          {group.name}
        </span>
      )}
    </>
  );
};

export default EditableName;
