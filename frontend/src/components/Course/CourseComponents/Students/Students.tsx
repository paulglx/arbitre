import React from 'react'
import StudentGroups from './StudentGroups'
import StudentsInvite from './StudentsInvite'
import StudentsList from './StudentsList/StudentsList'
import { useState } from 'react'

const Students = (props: any) => {

    const [studentGroups, setStudentGroups] = useState<any>(props.course.student_groups)

    return (<>
        <StudentsInvite course={props.course} />
        <br />
        <StudentGroups course={props.course} studentGroups={studentGroups} setStudentGroups={setStudentGroups} setCourse={props.setCourse} />
        <StudentsList course={props.course} setCourse={props.setCourse} />
    </>)
}

export default Students