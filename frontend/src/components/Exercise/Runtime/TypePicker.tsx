import { DocumentTextIcon, FolderOpenIcon } from '@heroicons/react/20/solid';

import { pushNotification } from '../../../features/notification/notificationSlice';
import { useDispatch } from 'react-redux';
import { useUpdateExerciseMutation } from '../../../features/courses/exerciseApiSlice';

const TypePicker = (props: any) => {

    const { exercise, type, setType } = props;
    const [updateExercise] = useUpdateExerciseMutation();
    const dispatch = useDispatch();

    const enabledStyle = "outline outline-2 shadow-lg"
    const singleEnabledStyle = "bg-blue-50 border-blue-300 outline-blue-400 shadow-blue-100"
    const multiEnabledStyle = "bg-indigo-50 border-indigo-300 outline-indigo-400 shadow-indigo-100"
    const disabledStyle = "bg-gray-50 border-gray-300 outline-gray-400 shadow-gray-100 border-dashed"

    const handleSwitchType = async (e: any) => {

        const oldType = type;
        const newType = type === "single" ? "multiple" : "single"

        e.preventDefault();

        setType(newType);

        await updateExercise({
            id: exercise.id,
            type: newType,
        })
            .unwrap()
            .catch(() => {
                dispatch(pushNotification({
                    message: "There was an error while changing the exercise type",
                    type: "error"
                }))
                setType(oldType);
            })
    }

    return (
        <div className="p-1 mb-4">

            <div hidden className={`${enabledStyle} ${singleEnabledStyle} ${multiEnabledStyle} ${disabledStyle}`} />

            <h2 className='text-md font-semibold'>Exercise Type</h2>
            <p className='text-sm text-gray-500 mb-2'>
                Chose whether students can send one file or a whole codebase.
            </p>

            <div className='border rounded-xl'>
                <div className='flex flex-col md:flex-row gap-2 p-2'>
                    <button
                        className={`px-4 py-2 border basis-1/2 rounded-lg ${type === "single" ? enabledStyle + " " + singleEnabledStyle : disabledStyle} `}
                        onClick={handleSwitchType}
                        disabled={type === "single"}
                    >
                        <h3 className={`flex flex-row items-center justify-center font-bold ${type === "single" ? "text-blue-700" : "text-gray-400"}`}>
                            <DocumentTextIcon className='size-4 mr-1' />
                            Single File
                        </h3>
                        <p className={`text-sm ${type === "single" ? "text-blue-500" : "text-gray-400"}`}>Quick and simple. ~0.2s submission-to-result.</p>
                    </button>

                    <button
                        className={`px-4 py-2 border basis-1/2 rounded-lg ${type === "multiple" ? enabledStyle + " " + multiEnabledStyle : disabledStyle} `}
                        onClick={handleSwitchType}
                    >
                        <h3 className={`flex flex-row items-center justify-center font-bold ${type === "multiple" ? "text-indigo-600" : "text-gray-400"}`}>
                            <FolderOpenIcon className='size-4 mr-1' />
                            Multiple Files
                        </h3>
                        <p className={`text-sm ${type === "multiple" ? "text-indigo-500" : "text-gray-400"}`}>Heavy computation. ~3s submission-to-result.</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TypePicker