import { useSetAutoGroupsMutation, useSetGroupsEnabledMutation } from '../../../../features/courses/courseApiSlice'

import React from 'react'
import { pushNotification } from '../../../../features/notification/notificationSlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'

const StudentGroups = (props: any) => {

    const course = props.course
    const setCourse = props.setCourse

    const [groupsEnabled, setGroupsEnabled] = useState<any>(course.groups_enabled)
    const [autoGroupsEnabled, setAutoGroupsEnabled] = useState<any>(course.auto_groups_enabled)
    const [autoGroupsNumber, setAutoGroupsNumber] = useState<any>(course.auto_groups_number)

    const [changeGroupsEnabled] = useSetGroupsEnabledMutation()
    const [changeAutoGroups] = useSetAutoGroupsMutation()

    const dispatch = useDispatch()

    const toggleGroupsEnabled = async () => {
        const beforeChange = groupsEnabled
        setGroupsEnabled(!beforeChange)

        await changeGroupsEnabled({ course_id: course.id, groups_enabled: !beforeChange })
            .unwrap()
            .catch((e) => {
                dispatch(pushNotification({ message: "Unable to toggle groups.", type: "error" }))
            })
            .then((res) => {
                setCourse(res)
            })
    }

    const toggleAutoGroups = async () => {
        const beforeChange = autoGroupsEnabled
        setAutoGroupsEnabled(!beforeChange)

        await changeAutoGroups({ course_id: course.id, auto_groups_enabled: !beforeChange })
            .unwrap()
            .catch((e) => {
                dispatch(pushNotification({ message: "Unable to toggle auto groups.", type: "error" }))
            })
            .then((res) => {
                setAutoGroupsEnabled(res.auto_groups_enabled)
            })
    }

    // Uses optimistic updates :)
    const autoGroupsNumberChange = async (i: number) => {
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


    const Container = (props: any) => {
        return (
            <div className="flex flex-row items-center justify-between px-4 py-2 mb-4 bg-gray-50 border rounded-lg">
                {props.children}
            </div>
        )
    }

    const GroupsToggle = (props: any) => {
        return (
            <div className="flex flex-row items-center">
                <input
                    type="checkbox"
                    className="mr-2"
                    checked={groupsEnabled}
                    onChange={toggleGroupsEnabled}
                />
                <label>Groups</label>
            </div>
        )
    }

    const AutoGroupsToggle = (props: any) => {
        return (
            <div className="flex flex-row items-center">
                <input
                    type="checkbox"
                    className="mr-2"
                    checked={autoGroupsEnabled}
                    onChange={toggleAutoGroups}
                />
                <label>Auto groups</label>
            </div>
        )
    }

    if (!groupsEnabled) return (<Container>
        <GroupsToggle />
    </Container>)

    return autoGroupsEnabled ? (<Container>
        <GroupsToggle />
        <AutoGroupsToggle />
        <div className="flex flex-row items-center">
            <label className="mr-2">Number of groups:</label>
            <button
                className={`font-mono px-2 font-bold align-middle ${autoGroupsNumber <= 2 ? 'opacity-25 cursor-not-allowed' : ''}`}
                onClick={() => autoGroupsNumberChange(-1)}
                disabled={autoGroupsNumber <= 2}
            >
                -
            </button>
            <span className='font-mono font-bold bg-white border rounded px-1 '>{autoGroupsNumber}</span>
            <button
                className={`font-mono px-2 font-bold align-middle ${autoGroupsNumber === course?.students?.length ? 'opacity-25 cursor-not-allowed' : ''}`}
                onClick={() => autoGroupsNumberChange(1)}
                disabled={autoGroupsNumber === course.students.length}
            >
                +
            </button>

        </div>
    </Container>) : (<Container>
        <GroupsToggle />
        <AutoGroupsToggle />
    </Container>)
}

export default StudentGroups