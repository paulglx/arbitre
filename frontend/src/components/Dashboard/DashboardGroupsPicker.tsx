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

    return (<div id="relative inline-block text-left">

        <button
            id="dashboard-groups-picker-button"
            aria-haspopup="true"
            aria-expanded="true"
            aria-label="Select groups"
            ref={dropdownButtonRef}
            onClick={() => { setDropdownOpen(!dropdownOpen) }}
            className="flex flex-row items-center justify-center w-72 h-12 border rounded-md bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            type="button"

        >
            Groups
        </button>

        <div
            className={"absolute mt-3 origin-center z-10 border bg-white w-72 p-3 " + (dropdownOpen ? "visible" : "hidden")}
        >
            <div className="" ref={dropdownMenuRef}>
                {sortedGroups?.map((group: any) => {
                    return (
                        <button
                            key={group.id}
                            onClick={() => {
                                if (selectedGroups.includes(group.id)) {
                                    props.setSelectedGroups(selectedGroups.filter((id: number) => id !== group.id))
                                } else {
                                    props.setSelectedGroups([...selectedGroups, group.id])
                                }
                            }}
                        >
                            <GroupBadge
                                group={group}
                                selected={selectedGroups.includes(group.id)}
                                size={"lg"}
                            />
                        </button>
                    )
                }
                )}
            </div>
        </div>
    </div>)
}

export default DashboardGroupsPicker