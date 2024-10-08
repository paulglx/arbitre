import * as zip from "@zip.js/zip.js";

import { ChangeEvent, useMemo, useState } from "react";

import { DocumentIcon } from "@heroicons/react/24/solid";
import { pushNotification } from "../../../../features/notification/notificationSlice";
import { useCreateSubmissionMutation } from "../../../../features/submission/submissionApiSlice";
import { useDispatch } from "react-redux";

const SubmissionMultifileField = (props: any) => {
  const { exercise } = props;
  const dispatch = useDispatch();
  const [createSubmission] = useCreateSubmissionMutation();

  const [files, setFiles] = useState<FileList | null>(null);
  const [isValid, setIsValid] = useState(false);

  const isMac = navigator.userAgent.includes("Mac");
  const holdKey = isMac ? "command" : "control";

  const filesAsList = useMemo(() => {
    return files ? Array.from(files) : [];
  }, [files]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);

    if (e.target.files?.length === 0) {
      setIsValid(false);
      return;
    }

    const filesAsList = Array.from(e.target.files as FileList);

    // Check if there is no "run" or "compile" file
    const hasRunFile = filesAsList.some((file) => file.name === "run");
    const hasCompileFile = filesAsList.some((file) => file.name === "compile");

    let isValid = true;

    if (hasRunFile) {
      dispatch(
        pushNotification({
          message: "You can't add a file named 'run'.",
          type: "error",
        })
      );
      isValid = false;
    }
    if (hasCompileFile) {
      setIsValid(false);
      dispatch(
        pushNotification({
          message: "You can't add a file named 'compile'.",
          type: "error",
        })
      );
      isValid = false;
    }

    setIsValid(isValid);
  };

  const generateZip = async () => {
    const zipFileWriter = new zip.BlobWriter("application/zip");
    const zipWriter = new zip.ZipWriter(zipFileWriter);

    for (const file of filesAsList) {
      await zipWriter.add(file.name, new zip.BlobReader(file));
    }

    const zipFile = await zipWriter.close();

    return zipFile;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const form = e.target[0];

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    const student_files = await generateZip();

    console.log(student_files);

    const formData = new FormData();
    formData.append("exercise", exercise.id);
    formData.append("file", student_files, "student_files.zip");

    await createSubmission(formData)
      .unwrap()
      .catch(() => {
        dispatch(
          pushNotification({
            message:
              "There was an error while creating the submission. Your files were not submitted.",
            type: "error",
          })
        );
      });
  };

  const FileList = () => {
    return (
      <div className="mb-1 empty:hidden text-xs pt-4">
        {filesAsList?.map((file, index) => {
          return (
            <span key={index} className="mx-1">
              <span className="inline-flex items-center font-mono border rounded-lg px-2 py-1 bg-indigo-50 border-indigo-300 text-indigo-800 shadow-sm">
                <DocumentIcon className="inline h-3 w-3 text-indigo-600 mr-1" />
                {file.name}
              </span>
            </span>
          );
        })}
      </div>
    );
  };

  const KeyboardHint = () => {
    return (
      <div className="text-gray-400 text-xs mt-1">
        Hold&nbsp;
        <kbd className="inline-flex justify-center items-center py-0.5 px-1 bg-gray-50 text-gray-500 border font-mono rounded-md shadow-[0px_2px_0px_0px_rgba(0,0,0,0.08)]">
          {holdKey}
        </kbd>{" "}
        to select multiple files
      </div>
    );
  };

  return (
    <div className="pb-4">
      <form
        className="flex items-center justify-between space-x-3 rounded-lg pt-2"
        onSubmit={handleSubmit}
      >
        <label className="block bg-white rounded-lg border p-2 w-full">
          <span className="sr-only">Send your file</span>
          <input
            type="file"
            className="block w-full text-sm text-gray-500
                    file:mr-2 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    file:cursor-pointer file:transition-colors
                    hover:file:bg-indigo-100
                "
            multiple
            onChange={handleFileChange}
          />
        </label>

        <button
          type="submit"
          className={`rounded-lg px-6 py-3 font-semibold border transition-colors
                ${
                  isValid
                    ? `bg-indigo-50 text-indigo-700  border-indigo-200 hover:bg-indigo-100`
                    : `bg-gray-100 text-gray-500 border-gray-200`
                }`}
          disabled={!isValid}
        >
          Submit
        </button>
      </form>
      <KeyboardHint />

      <FileList />
    </div>
  );
};

export default SubmissionMultifileField;
