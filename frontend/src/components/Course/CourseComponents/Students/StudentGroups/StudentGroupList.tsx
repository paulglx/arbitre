import { useAddStudentGroupMutation, useRemoveStudentGroupMutation } from '../../../../../features/courses/studentGroupApiSlice'

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

    return (<>
        {sortedGroups?.map((group: any, i: number) => {
            return (
                <div key={i}>
                    {i + 1} {group.name}
                    <button className='border rounded-lg px-2 py-1' onClick={() => handleRemoveStudentGroup(group)}>Remove</button>
                </div >
            )

        })}
        <button className='border rounded-lg px-2 py-1' onClick={handleAddStudentGroup}>Add student group</button>
    </>)
}

export default StudentGroupList