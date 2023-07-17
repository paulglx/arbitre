import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import { useSetAutoGroupsMutation, useSetGroupsEnabledMutation } from '../../../../../features/courses/courseApiSlice'

import StudentGroupsAutoGroups from './StudentGroupsAutoGroups'
import { pushNotification } from '../../../../../features/notification/notificationSlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'

const StudentGroups = (props: any) => {

    const course = props.course
    const setCourse = props.setCourse

    const [accordionOpened, setAccordionOpened] = useState<any>(false)
    const [groupsEnabled, setGroupsEnabled] = useState<any>(course.groups_enabled)
    const [autoGroupsEnabled, setAutoGroupsEnabled] = useState<any>(course.auto_groups_enabled)
    const [autoGroupsNumber, setAutoGroupsNumber] = useState<any>(course.auto_groups_number)

    const [changeGroupsEnabled] = useSetGroupsEnabledMutation()
    const [changeAutoGroups] = useSetAutoGroupsMutation()

    const dispatch = useDispatch()

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

    const GroupsToggle = (props: any) => {
        return (
            <div className='flex mb-8'>
                <div className="flex items-baseline h-5">
                    <input
                        aria-describedby='groups-enabled-description'
                        id="groups-enabled-checkbox"
                        type="checkbox"
                        className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={groupsEnabled}
                        onChange={toggleGroupsEnabled}
                    />
                    <div className="ml-2">
                        <label htmlFor="groups-enabled-checkbox" className="font-medium text-gray-900 dark:text-gray-300">Enable Groups</label>
                        <p id="helper-checkbox-text" className="text-sm font-normal text-gray-500 dark:text-gray-300">
                            Students will be assigned to groups.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const AutoGroupsToggle = (props: any) => {
        return (
            <div className='flex mb-8'>
                <div className="flex items-baseline h-5">
                    <input
                        aria-describedby='groups-enabled-description'
                        id="groups-enabled-checkbox"
                        type="checkbox"
                        className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={autoGroupsEnabled}
                        onChange={toggleAutoGroups}
                    />
                    <div className="ml-2">
                        <label htmlFor="groups-enabled-checkbox" className="font-medium text-gray-900 dark:text-gray-300">Enable automatic groups</label>
                        <p id="helper-checkbox-text" className="text-sm font-normal text-gray-500 dark:text-gray-300">
                            Groups will be automatically generated based on the number of groups you specify, and filled with students in alphabetical order.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='mb-2'>
            <div
                className={`
                    flex flex-row items-center justify-between px-4 py-2 border cursor-pointer
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
                <div className="px-4 py-2 border border-t-0 rounded-b-lg">
                    <GroupsToggle />
                    <div className={`${groupsEnabled ? '' : 'opacity-25 disabled'}`}>
                        <AutoGroupsToggle />
                        {autoGroupsEnabled ?
                            <div className="ml-1.5 pl-4 border-l border-gray-400">
                                <StudentGroupsAutoGroups
                                    autoGroupsNumber={autoGroupsNumber}
                                    course={course}
                                    groupsEnabled={groupsEnabled}
                                    setAutoGroupsNumber={setAutoGroupsNumber}
                                    setCourse={setCourse}
                                />
                            </div>
                            : <></>
                        }
                    </div>
                </div>
                : <></>
            }


        </div>
    )


}

export default StudentGroups