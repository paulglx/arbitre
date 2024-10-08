import { pushNotification } from '../../../../features/notification/notificationSlice';
import { useDispatch } from 'react-redux';
import { useSetTeacherFilesMutation } from '../../../../features/courses/exerciseApiSlice';

const TeacherFilesField = (props: any) => {

    const { exercise } = props;

    const dispatch = useDispatch();
    const [setTeacherFiles] = useSetTeacherFilesMutation();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const form = e.target[0];

        if (form.files.length === 0) {
            dispatch(pushNotification({
                message: "Please select a zip file",
                type: "error"
            }));
            return;
        }

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        const data = {
            id: exercise.id,
            teacher_files: form.files[0]
        }

        await setTeacherFiles(data)
            .unwrap()
            .catch(() => {
                dispatch(pushNotification({
                    message: "There was an error while setting the teacher files. Your file was not submitted.",
                    type: "error"
                }));
            })
            .then(() => {
                window.location.reload();
            })
    }

    return (
        <form
            className="flex items-center justify-between space-x-3 rounded-lg pt-2 pb-4"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
        >
            <label className="block bg-white rounded-lg border p-2 w-full">

                <span className="sr-only">Select a zip file</span>
                <input
                    type="file"
                    className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 file:cursor-pointer file:transition-colors hover:file:bg-indigo-100"
                    accept='.zip'
                />
            </label>

            <button type="submit" className="rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold border border-indigo-300 hover:bg-indigo-100 transition-colors">Submit</button>

        </form>
    )
}

export default TeacherFilesField