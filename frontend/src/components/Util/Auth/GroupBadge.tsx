import React from 'react'

export interface Group {
    id: number,
    name: string,
}

export interface GroupBadgeProps {
    group: Group,
    size?: "xs" | "sm" | "md" | "lg"
}

const GroupBadge = ({ group, size }: GroupBadgeProps) => {

    size = size ? size : "md"

    const bgColor = [
        "blue",
        "indigo",
        "fuchsia",
    ][group?.id % 3]

    return (<>

        {/* Load these colors. They get tree-shaken otherwise */}
        <span className="hidden bg-blue-50 bg-indigo-50 bg-fuchsia-50 ring-blue-200 ring-indigo-200 ring-fuchsia-200"></span>

        <span className={`bg-${bgColor}-50 ring-2 ring-inset ring-${bgColor}-200 text-gray-800 text-${size} font-medium px-2.5 py-0.5 rounded-${size}`}>
            {group?.name}
        </span >
    </>)
}

export default GroupBadge