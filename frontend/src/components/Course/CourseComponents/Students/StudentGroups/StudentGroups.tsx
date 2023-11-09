import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import { useSetAutoGroupsMutation, useSetGroupsEnabledMutation } from '../../../../../features/courses/studentGroupApiSlice'

import StudentGroupList from './StudentGroupList'
import { pushNotification } from '../../../../../features/notification/notificationSlice'
import { selectCurrentUser } from '../../../../../features/auth/authSlice'
import { useState } from 'react'

const StudentGroups = (props: any) => {

    const course = props.course
    const setCourse = props.setCourse
    const groups = props.groups

    const [accordionOpened, setAccordionOpened] = useState<any>(false)
    const [groupsEnabled, setGroupsEnabled] = useState<any>(course.groups_enabled)
    const [autoGroupsEnabled, setAutoGroupsEnabled] = useState<any>(course.auto_groups_enabled)

    const [changeGroupsEnabled] = useSetGroupsEnabledMutation()
    const [changeAutoGroups] = useSetAutoGroupsMutation()

    const dispatch = useDispatch()

    const username = useSelector(selectCurrentUser);
    const isOwner = course?.owners?.map((owner: any) => owner.username).includes(username);

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
        if (!groupsEnabled) return;
        const beforeChange = autoGroupsEnabled
        setAutoGroupsEnabled(!beforeChange)

        await changeAutoGroups({ course_id: course.id, auto_groups_enabled: !beforeChange })
            .unwrap()
            .catch((e) => {
                dispatch(pushNotification({ message: "Unable to toggle auto groups.", type: "error" }))
            })
            .then((res) => {
                setCourse(res)
            })
    }

    const GroupsToggle = (props: any) => {
        return (
            <div className="flex items-baseline mb-2">
                <input
                    aria-describedby='groups-enabled-description'
                    id="groups-enabled-checkbox"
                    type="checkbox"
                    className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    checked={groupsEnabled}
                    onChange={toggleGroupsEnabled}
                />
                <div className="ml-2">
                    <label htmlFor="groups-enabled-checkbox" className="font-medium text-gray-900">Enable groups</label>
                    <p id="groups-info-text" className="text-sm font-normal text-gray-500">
                        {groupsEnabled ? "Groups are enabled." : "Groups are disabled."}
                    </p>
                </div>
            </div>
        )
    }

    const AutoGroupsToggle = (props: any) => {
        return (
            <div>
                <div className="flex items-baseline">
                    <input
                        aria-describedby='auto-groups-enabled-description'
                        id="auto-groups-enabled-checkbox"
                        type="checkbox"
                        className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        checked={autoGroupsEnabled}
                        onChange={toggleAutoGroups}
                    />
                    <div className="ml-2">
                        <label htmlFor="auto-groups-enabled-checkbox" className="font-medium text-gray-900">Enable automatic groups</label>
                        <p id="auto-groups-info-text" className="text-sm font-normal text-gray-500">
                            {autoGroupsEnabled ?
                                "Groups are filled automatically with students in alphabetical order."
                                :
                                "Owners can manually set student groups."
                            }

                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const GroupsListWrapper = () => {
        return (<>
            <div className="p-1 mt-1">
                <label htmlFor="auto-groups-enabled-checkbox" className="font-medium text-gray-900">Groups</label>
                <p id="auto-groups-info-text" className="text-sm font-normal text-gray-500">
                    Click on a group to edit its name.
                </p>
                <StudentGroupList course={course} setCourse={setCourse} groups={groups} />
            </div>

        </>)
    }

    return isOwner ? (
        <div className='mb-2'>
            <div
                className={`
                    flex flex-row items-center justify-between px-4 py-3 border cursor-pointer
                    ${accordionOpened ?
                        'bg-gray-100 hover:bg-gray-200 rounded-t-lg'
                        :
                        ' bg-gray-50 hover:bg-gray-100 rounded-lg'
                    }
                `}
                onClick={() => setAccordionOpened(!accordionOpened)}
            >
                <span className="mr-2 font-medium">Manage Groups</span>
                {accordionOpened ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </div>

            {accordionOpened ?
                <div className="p-4 border border-t-0 rounded-b-lg">
                    <GroupsToggle />
                    <div className={`${groupsEnabled ? '' : 'opacity-25 disabled pointer-events-none select-none'}`}>
                        <AutoGroupsToggle />
                        <GroupsListWrapper />
                    </div>
                </div>
                : <></>
            }
        </div>
    ) : (<></>)


}

export default StudentGroups