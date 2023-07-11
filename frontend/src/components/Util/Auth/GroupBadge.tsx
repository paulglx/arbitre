import React from 'react'

export interface Group {
    id: number,
    name: string,
}

export interface GroupBadgeProps {
    selected?: boolean,
    group: Group,
    size?: "xs" | "sm" | "md" | "lg"
}

const GroupBadge = ({ group, selected, size }: GroupBadgeProps) => {

    size = size ? size : "md"

    console.log(
        `GroupBadge: group=${group.name}, selected=${selected}, size=${size}`
    )

    const bgColor = [
        "blue",
        "violet",
        "fuchsia",
    ][group.id % 3]

    return (<>

        {/* Load these colors. They get tree-shaken otherwise */}
        <span className="hidden bg-blue-50 bg-violet-50 bg-fuchsia-50 bg-blue-100 bg-violet-100 bg-fuchsia-100 ring-blue-100 ring-violet-100 ring-fuchsia-100"></span>

        <span
            className={
                selected ?
                    `bg-${bgColor}-50 ring-2 ring-inset ring-${bgColor}-200 text-gray-800 text-${size} font-medium px-2.5 py-0.5 rounded`
                    :
                    `bg-gray-50 ring-2 ring-inset ring-gray-100 text-gray-800 text-${size} font-medium px-2.5 py-0.5 rounded`
            }
        >
            {group.name}
        </span>
    </>)
}

export default GroupBadge