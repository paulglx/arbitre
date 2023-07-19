import { useAddStudentGroupMutation, useRemoveStudentGroupMutation } from '../../../../../features/courses/studentGroupApiSlice'

import EditableName from './EditableName'
import { pushNotification } from '../../../../../features/notification/notificationSlice'
import { useDispatch } from 'react-redux'
import { useMemo } from 'react'

const StudentGroupList = (props: any) => {

    const course = props.course
    const setCourse = props.setCourse
    const groups = props.groups

    const sortedGroups = useMemo(() => {
        const groupsToSort = structuredClone(groups)
        if (groupsToSort) {
            return groupsToSort.sort((a: any, b: any) => {
                return a.id - b.id
            })
        }
    }, [groups])

    const dispatch = useDispatch()

    const [addStudentGroup] = useAddStudentGroupMutation()
    const [removeStudentGroup] = useRemoveStudentGroupMutation()

    const handleAddStudentGroup = async () => {
        await addStudentGroup({
            course: course.id,
            name: `Group ${groups.length + 1}`
        })
            .unwrap()
            .catch((e) => {
                dispatch(pushNotification({ message: "Unable to add student group.", type: "error" }))
            })
            .then((res) => {
                if (res.course) setCourse(res.course)
            })
    }

    const handleRemoveStudentGroup = async (group: any) => {
        await removeStudentGroup({
            id: group.id
        })
            .unwrap()
            .catch((e) => {
                dispatch(pushNotification({ message: "Unable to remove student group.", type: "error" }))
            })
            .then((res) => {
                if (res.course) setCourse(res.course)
            })
    }

    return (<div className='flex flex-col w-1/2'>
        {sortedGroups?.map((group: any, i: number) => {
            return (
                <div className='flex flex-row items-center justify-between' key={i}>
                    <div>
                        <span className='text-gray-400 text-sm'>{i + 1}</span> &nbsp;
                        <EditableName group={group} setCourse={setCourse} />
                    </div>
                    <button className='border rounded-md bg-gray-50 text-sm px-2 py-1' onClick={() => handleRemoveStudentGroup(group)}>Remove</button>
                </div>
            )

        })}
        <button className='border rounded-lg bg-gray-50 px-2 py-1' onClick={handleAddStudentGroup}>Add student group</button>
    </div>)
}

export default StudentGroupList