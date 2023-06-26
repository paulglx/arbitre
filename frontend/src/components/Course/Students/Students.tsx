import React from 'react'
import StudentsInvite from './StudentsInvite'
import StudentsList from './StudentsList'

const Students = (props: any) => {
    return (<>
        <StudentsInvite course={props.course} />
        <br />
        <StudentsList course={props.course} />
    </>)
}

export default Students