import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { Modal } from "../../../Common"
import { TrashIcon } from "@heroicons/react/20/solid"
import { pushNotification } from "../../../../features/notification/notificationSlice"
import { useDispatch } from "react-redux"
import { useRemoveTeacherFilesMutation } from "../../../../features/courses/exerciseApiSlice"
import { useState } from "react"

const RemoveTeacherFiles = (props: any) => {

    const { exercise } = props;

    const dispatch = useDispatch();
    const [removeTeacherFiles] = useRemoveTeacherFilesMutation();

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleDelete = async (e: any) => {
        e.preventDefault();

        await removeTeacherFiles({
            id: exercise.id
        })
            .unwrap()
            .catch(() => {
                dispatch(pushNotification({
                    message: "There was an error while removing the teacher files. Your file was not submitted.",
                    type: "error"
                }));
            })
            .then(() => {
                window.location.reload();
            })
    }

    return (<>
        <button
            className="inline p-1 ml-1 text-gray-500 border bg-gray-50 hover:text-red-800 hover:border-red-300 hover:bg-red-50 transition-all rounded-md"
            onClick={() => setModalIsOpen(true)}
            aria-label='Delete teacher files'
        >
            <TrashIcon className="w-4 h-4" />
            <span className="sr-only">Remove teacher files</span>
        </button>
        {modalIsOpen &&
            <Modal
                title="Are you sure?"
                icon={<ExclamationTriangleIcon className="text-yellow-500 w-8 h-8" />}
                decription={<p className='text-sm text-gray-600 mb-2'>
                    This will permanently delete these teacher files from the server. Tests won't be able to run until you upload new teacher files.
                </p>}
                handleCloseModal={() => setModalIsOpen(false)}
                delete={handleDelete}
            />
        }
    </>)
}

export default RemoveTeacherFiles