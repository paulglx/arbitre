import GroupBadge from '../../../../Util/Auth/GroupBadge'
import React from 'react'

const StudentsListGroupIndicator = (props: any) => {

    const course = props.course
    const student = props.student

    if (!course?.groups_enabled) return null;

    //console.log(course)

    return course?.auto_groups_enabled ? (
        <GroupBadge group={student.student_group} size={'sm'} />
    ) : (
        <>

        </>
    )
}

export default StudentsListGroupIndicator