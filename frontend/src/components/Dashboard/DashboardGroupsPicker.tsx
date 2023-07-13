import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"
import { createRef, useMemo, useState } from "react"

import GroupBadge from "../Util/Auth/GroupBadge"

const DashboardGroupsPicker = (props: any) => {

    const course = props.course
    const selectedGroups = props.selectedGroups
    const groups = course?.student_groups

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownButtonRef = createRef<HTMLButtonElement>()
    const dropdownMenuRef = createRef<HTMLDivElement>()

    const sortedGroups = useMemo(() => {
        const groupsToSort = structuredClone(groups)
        if (groupsToSort) {
            return groupsToSort.sort((a: any, b: any) => {
                return a.name.localeCompare(b.name)
            })
        }
    }, [groups])

    console.log(sortedGroups, selectedGroups)

    return (<div id="relative inline-block text-left">

        <button
            aria-expanded="true"
            aria-haspopup="true"
            aria-label="Select groups"
            className="px-2 py-1 rounded-lg bg-blue-50 border-2 border-blue-200 text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold"
            id="dashboard-groups-picker-button"
            onClick={() => { setDropdownOpen(!dropdownOpen) }}
            ref={dropdownButtonRef}
            type="button"
        >
            Filter by groups
            {dropdownOpen ?
                <ChevronUpIcon className="inline-block h-4 w-4 ml-2" />
                :
                <ChevronDownIcon className="inline-block h-4 w-4 ml-2" />
            }
        </button>

        <div
            aria-labelledby="dashboard-groups-picker-button"
            id="dashboard-groups-picker-dropdown-menu"
            role="menu"
            ref={dropdownMenuRef}
            className={"absolute mt-2 origin-center z-10 border bg-white rounded-lg " + (dropdownOpen ? "visible" : "hidden")}
        >
            <div className="flex-col divide-y" ref={dropdownMenuRef}>
                {sortedGroups?.map((group: any) => {
                    return (
                        <div
                            className={`
                                flex justify-between items-center p-2  cursor-pointer
                                ${selectedGroups.includes(group.id) ? "bg-blue-50 hover:bg-blue-100" : "bg-white hover:bg-gray-50"}
                            `}
                            onClick={() => {
                                if (selectedGroups.includes(group.id)) {
                                    props.setSelectedGroups(selectedGroups.filter((id: number) => id !== group.id))
                                } else {
                                    props.setSelectedGroups([...selectedGroups, group.id])
                                }
                            }}
                        >
                            {selectedGroups.includes(group.id) ?
                                <CheckIcon className="h-6 w-6 text-blue-500 right-2 top-2 mr-2" />
                                :
                                <div className="h-6 w-6 right-2 top-2 mr-2" />
                            }
                            <GroupBadge
                                group={group}
                                size={"lg"}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    </div>)
}

export default DashboardGroupsPicker