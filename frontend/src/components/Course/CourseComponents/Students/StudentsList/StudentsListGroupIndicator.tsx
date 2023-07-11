import GroupBadge from '../../../../Util/Auth/GroupBadge'
import React from 'react'

const StudentsListGroupIndicator = (props: any) => {

    const student = props.student

    return (
        <GroupBadge group={student.student_group} size={"sm"} selected={true} />
    )
}

export default StudentsListGroupIndicator