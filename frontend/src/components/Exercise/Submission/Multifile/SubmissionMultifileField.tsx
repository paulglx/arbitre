import * as zip from "@zip.js/zip.js";

import { ChangeEvent, useEffect, useMemo, useState } from "react"

import { pushNotification } from "../../../../features/notification/notificationSlice";
import { useCreateSubmissionMutation } from "../../../../features/submission/submissionApiSlice";
import { useDispatch } from "react-redux";

const SubmissionMultifileField = (props: any) => {

    const { exercise } = props;
    const dispatch = useDispatch();
    const [createSubmission] = useCreateSubmissionMutation();

    const [files, setFiles] = useState<FileList | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    }

    const filesAsList = useMemo(() => {
        return files ? Array.from(files) : [];
    }, [files]);

    const generateZip = async () => {
        const zipFileWriter = new zip.BlobWriter("application/zip");
        const zipWriter = new zip.ZipWriter(zipFileWriter);

        for (const file of filesAsList) {
            await zipWriter.add(file.name, new zip.BlobReader(file));
        }

        const zipFile = await zipWriter.close();

        return zipFile;
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const form = e.target[0];

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        const student_files = await generateZip();

        console.log(student_files)

        const formData = new FormData();
        formData.append("exercise", exercise.id)
        formData.append("file", student_files, "student_files.zip");

        await createSubmission(formData)
            .unwrap()
            .then(() => {
                //window.location.reload();
            })
            .catch(() => {
                dispatch(pushNotification({
                    message: "There was an error while creating the submission. Your files were not submitted.",
                    type: "error"
                }));
            })
    }

    const FileList = () => {
        return (
            <div className="mb-1 empty:hidden text-xs pt-4">
                {filesAsList?.map((file, index) => {
                    return (
                        <span key={index} className="mx-1">
                            <span className="font-mono border rounded-lg px-2 py-1 bg-indigo-50 border-indigo-300 text-indigo-800 shadow-sm">
                                {file.name}
                            </span>
                        </span>
                    )
                })}
            </div>
        )
    }

    return (<div className="pb-4">
        <form
            className="flex items-center justify-between space-x-3 rounded-lg pt-2"
            onSubmit={handleSubmit}
        >
            <label className="block bg-white rounded-lg border p-2 w-full">
                <span className="sr-only">Send your file</span>
                <input type="file" className="block w-full text-sm text-gray-500
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

            <button type="submit" className='rounded-lg bg-indigo-50 px-6 py-3 text-indigo-700 font-semibold border border-indigo-200 hover:bg-indigo-100 transition-colors'>
                Submit
            </button>
        </form>

        <FileList />
    </div>)
}

export default SubmissionMultifileField