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


    const name = group?.name
    const id = group?.id

    size = size ? size : "md"

    const bgColor = [
        "blue",
        "indigo",
        "fuchsia",
    ][id % 3]

    return (<>

        {/* Load these colors. They get tree-shaken otherwise */}
        <span className="hidden bg-blue-50 bg-indigo-50 bg-fuchsia-50 ring-blue-200 ring-indigo-200 ring-fuchsia-200"></span>

        <span className={`px-2 py-1 rounded-lg border-2 font-semibold
            bg-${bgColor}-50 border-${bgColor}-200 text-${bgColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${bgColor}-500`}>
            {name ? name : "No group"}
        </span >
    </>)
}

export default GroupBadge