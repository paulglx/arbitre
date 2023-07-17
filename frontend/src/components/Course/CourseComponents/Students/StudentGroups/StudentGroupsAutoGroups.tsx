import { pushNotification } from '../../../../../features/notification/notificationSlice'
import { useDispatch } from 'react-redux'
import { useSetAutoGroupsMutation } from '../../../../../features/courses/courseApiSlice'

const StudentGroupsAutoGroups = (props: any) => {

    const autoGroupsNumber = props.autoGroupsNumber
    const course = props.course
    const groupsEnabled = props.groupsEnabled
    const setAutoGroupsNumber = props.setAutoGroupsNumber
    const setCourse = props.setCourse

    const dispatch = useDispatch()

    const [changeAutoGroups] = useSetAutoGroupsMutation()

    // Uses optimistic updates :)
    const autoGroupsNumberChange = async (i: number) => {

        if (!groupsEnabled) return;

        if (autoGroupsNumber + i < 2 || autoGroupsNumber + i > course.students.length) return;

        const beforeChange = autoGroupsNumber
        setAutoGroupsNumber(autoGroupsNumber + i)

        await changeAutoGroups({ course_id: course.id, auto_groups_number: autoGroupsNumber + i })
            .unwrap()
            .catch((e) => {
                dispatch(pushNotification({ message: "Unable to change auto groups number.", type: "error" }))
                setAutoGroupsNumber(beforeChange)
            })
            .then((res) => {
                setCourse(res)
            })
    }

    return (
        <div className="flex flex-row items-center">
            <label className="mr-2 font-medium">Number of automatic groups</label>
            <button
                className={`rounded bg-blue-600 hover:bg-blue-700 text-white font-mono px-2 mr-1 font-bold align-middle ${autoGroupsNumber <= 2 ? 'opacity-25 cursor-not-allowed' : ''}`}
                onClick={() => autoGroupsNumberChange(-1)}
                disabled={autoGroupsNumber <= 2}
            >
                -
            </button>
            <span className='font-mono font-bold bg-white border rounded px-2'>{autoGroupsNumber}</span>
            <button
                className={`rounded bg-blue-600 hover:bg-blue-700 text-white font-mono px-2 ml-1 font-bold align-middle ${autoGroupsNumber === course?.students?.length ? 'opacity-25 cursor-not-allowed' : ''}`}
                onClick={() => autoGroupsNumberChange(1)}
                disabled={autoGroupsNumber === course.students.length}
            >
                +
            </button>

        </div>
    )
}

export default StudentGroupsAutoGroups