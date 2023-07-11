import React from 'react'

const StudentsListGroupIndicator = (props: any) => {

    const student = props.student

    const bgColor = ["bg-blue-100", "bg-violet-100", "bg-fuchsia-100"][student.student_group?.id % 3]

    return (
        <span className={`${bgColor} text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded`}>
            {student.student_group?.name}
        </span>
    )
}

export default StudentsListGroupIndicator