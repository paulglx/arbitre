import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"
import { createRef, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"

import GroupBadge from '../../../../Util/Auth/GroupBadge'
import { pushNotification } from "../../../../../features/notification/notificationSlice"
import { selectCurrentUser } from "../../../../../features/auth/authSlice"
import { useSetStudentGroupMutation } from "../../../../../features/courses/studentGroupApiSlice"

const StudentsListGroupPicker = (props: any) => {

    const course = props.course
    const setCourse = props.setCourse
    const student = props.student
    const groups = props.groups
    const refetchGroups = props.refetchGroups

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownButtonRef = createRef<HTMLButtonElement>()
    const dropdownMenuRef = createRef<HTMLDivElement>()

    const dispatch = useDispatch()
    const [setStudentGroup] = useSetStudentGroupMutation()

    useEffect(() => {
        refetchGroups()
    }, [course, refetchGroups])

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownButtonRef.current && dropdownMenuRef.current) {
                if (
                    !dropdownButtonRef.current.contains(event.target) &&
                    !dropdownMenuRef.current.contains(event.target)
                ) {
                    setDropdownOpen(false)
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [dropdownButtonRef, dropdownMenuRef])


    const sortedGroups = useMemo(() => {
        const groupsToSort = structuredClone(groups)
        if (groupsToSort) {
            return groupsToSort.sort((a: any, b: any) => {
                return a.name.localeCompare(b.name)
            })
        }
    }, [groups])

    const username = useSelector(selectCurrentUser);

    const ownersUsernames = course?.owners?.map((owner: any) => owner.username);
    const isOwner = ownersUsernames?.includes(username);

    const handleSetStudentGroup = (student_group: number) => {
        setStudentGroup({
            user_id: student.id,
            student_group: student_group
        })
            .unwrap()
            .catch((e) => {
                dispatch(pushNotification({
                    message: "Something went wrong. Failed to set student group",
                    type: "error"
                }))
            })
            .then((res) => {
                if (res) setCourse(res.course)
                setDropdownOpen(false)
            })

    }

    if (!course?.groups_enabled) return null;

    const bgColor = student.student_group ?
        ["blue", "indigo", "fuchsia",][student?.student_group?.id % 3]
        :
        "gray"

    return !isOwner || course?.auto_groups_enabled ? (
        <GroupBadge group={student.student_group} size={'sm'} />
    ) : (
        <div className='relative inline-block'>
            {/* Load these colors. They get tree-shaken otherwise */}
            <span className="hidden
            text-blue-700 text-indigo-700 text-fuchsia-700
            bg-blue-50 bg-indigo-50 bg-fuchsia-50
            border-blue-200 border-indigo-200 border-fuchsia-200
            focus:ring-blue-500 focus:ring-indigo-500 focus:ring-fuchsia-500"></span>

            <button
                aria-expanded="true"
                aria-haspopup="true"
                aria-label="Select groups"
                className={`px-2 py-1 rounded-lg border-2 font-semibold
                bg-${bgColor}-50 border-${bgColor}-200 text-${bgColor}-700 hover:bg-${bgColor}-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${bgColor}-500`}
                id="students-list-group-indicator-button"
                onClick={() => { setDropdownOpen(!dropdownOpen) }}
                ref={dropdownButtonRef}
                type="button"
            >
                {dropdownOpen ?
                    <ChevronUpIcon className="inline-block h-4 w-4 mr-2" />
                    :
                    <ChevronDownIcon className="inline-block h-4 w-4 mr-2" />
                }
                {student?.student_group?.name || "Select a group"}
            </button>

            <div
                aria-labelledby="students-list-group-indicator-button"
                id="students-list-group-indicator-menu"
                role="menu"
                ref={dropdownMenuRef}
                className={"absolute mt-1 origin-center z-10 bg-white rounded-lg " + (dropdownOpen ? "visible" : "hidden")}
            >
                <div className="border-2 rounded-lg divide-y" ref={dropdownMenuRef}>
                    {sortedGroups?.map((group: any) => {
                        return (
                            <div
                                className={`flex px-4 py-2 justify-between items-center cursor-pointer hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg`}
                                onClick={() => { handleSetStudentGroup(group.id) }}
                                role="menuitem"
                                key={group.id}
                            >
                                {group.name}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default StudentsListGroupPicker