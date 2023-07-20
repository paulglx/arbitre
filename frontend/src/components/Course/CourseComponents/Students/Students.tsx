import StudentGroups from './StudentGroups/StudentGroups'
import StudentsInvite from './StudentsInvite'
import StudentsList from './StudentsList/StudentsList'

const Students = (props: any) => {
    return (<>
        <StudentsInvite course={props.course} />
        <br />
        <StudentGroups course={props.course} setCourse={props.setCourse} groups={props.groups} />
        <StudentsList course={props.course} setCourse={props.setCourse} groups={props.groups} refetchGroups={props.refetchGroups} />
    </>)
}

export default Students