import React from "react";
import { pushNotification } from "../../../../features/notification/notificationSlice";
import { useCreateSubmissionMutation } from "../../../../features/submission/submissionApiSlice";
import { useDispatch } from "react-redux";

const SubmissionFileField = (props: any) => {
  const { exercise } = props;
  const dispatch = useDispatch();

  const [createSubmission] = useCreateSubmissionMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const form = e.target[0];

    if (form.files.length === 0) {
      dispatch(
        pushNotification({
          message: "Please select a file",
          type: "error",
        })
      );
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    const formData = new FormData();
    formData.append("exercise", exercise.id);
    formData.append("file", form.files[0]);

    await createSubmission(formData)
      .unwrap()
      .catch(() => {
        dispatch(
          pushNotification({
            message:
              "There was an error while creating the submission. Your file was not submitted.",
            type: "error",
          })
        );
      });
  };

  return (
    <form
      className="flex items-center justify-between space-x-3 rounded-lg pt-2 pb-4"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <label className="block bg-white rounded-lg border p-2 w-full">
        <span className="sr-only">Send your file</span>
        <input
          type="file"
          className="block w-full text-sm text-gray-500
                    file:mr-2 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    file:cursor-pointer file:transition-colors
                    hover:file:bg-blue-100
                "
        />
      </label>

      <button
        type="submit"
        className="rounded-lg bg-blue-50 px-6 py-3 text-blue-700 font-semibold border border-blue-200 hover:bg-blue-100 transition-colors"
      >
        Submit
      </button>
    </form>
  );
};

export default SubmissionFileField;
