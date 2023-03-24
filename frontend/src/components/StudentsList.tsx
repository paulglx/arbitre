import { Button, Form, Table } from 'react-bootstrap'
import { PersonDash, PersonPlus } from 'react-bootstrap-icons'
import { useAddStudentMutation, useGetStudentsQuery, useRemoveStudentMutation } from '../features/courses/courseApiSlice'
import { useEffect, useState } from 'react'

import { useGetUsersQuery } from '../features/users/usersApiSlice'

const StudentsList = (props: any) => {

    const course = props.course
    const [students, setStudents] = useState<any>([])
    const [allUsers, setAllUsers] = useState<any>([])
    const [addableStudents, setAddableStudents] = useState<any>([])
    const [studentToAdd, setStudentToAdd] = useState<any>("")
    const [addStudent] = useAddStudentMutation()
    const [removeStudent] = useRemoveStudentMutation()

    const {
        data: studentsData,
        isSuccess: studentsSuccess,
    } = useGetStudentsQuery({ course_id: course.id })

    const {
        data: usersData,
        isSuccess: usersSuccess,
    } = useGetUsersQuery({})

    const handleAddStudent = async () => {

        const username = studentToAdd
        const user_id = allUsers.find((u: any) => u.username === username).id
        try {
            await addStudent({ course_id: course.id, user_id })
            setStudents([...students, { id: user_id, username: username }])
            setStudentToAdd("")
        } catch (e) {
            console.log(e)
        }

    }

    const handleRemoveStudent = async (user_id: number) => {
        await removeStudent({ course_id: course.id, user_id: user_id })
        setStudents(students.filter((s: any) => s.id !== user_id))
    }

    useEffect(() => {
        if (studentsSuccess) {
            setStudents(studentsData.students)
        }
    }, [studentsSuccess, studentsData])

    useEffect(() => {
        if (usersSuccess) {
            setAllUsers(usersData)
        }
    }, [usersSuccess, usersData])

    useEffect(() => {
        if (studentsSuccess && usersSuccess) {
            const studentsIds = students.map((s: any) => s.id)
            setAddableStudents(
                allUsers?.filter((u: any) => !studentsIds.includes(u.id))
            )
        }
    }, [studentsSuccess, usersSuccess, students, allUsers])

    return studentsSuccess ? (
        <div className='overflow-hidden rounded-4 border'>
            <Table hover className='mb-0'>
                <thead className='bg-light'>
                    <tr>
                        <th>Student</th>
                        <th className="text-end">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? students.map((student: any, i: number) => (
                        <tr key={i}>
                            <td>{student.username}</td>
                            <td className='text-end'>
                                <Button
                                    variant="outline-danger"
                                    className='p-0 px-1'
                                    onClick={() => handleRemoveStudent(student.id)}
                                    aria-label={"Remove student"}
                                >
                                    <PersonDash />
                                </Button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={2} className='text-center bg-light'>
                                There are no students in this course yet. <br />
                                <span className='text-muted'>Add students by giving them the course code or by entering their username below.</span>
                            </td>
                        </tr>
                    )}
                    <tr key={-1} className="">
                        <td className='align-items-center'>
                            <Form.Control
                                type="text"
                                placeholder="Enter student username"
                                list="studentOptions"
                                size="sm"
                                value={studentToAdd}
                                onChange={(e: any) => setStudentToAdd(e.target.value)}
                                aria-label="Add student"
                            />
                            <datalist id="studentOptions">
                                {addableStudents && addableStudents.map((u: any, i: number) => (
                                    <option key={i} value={u.username} />
                                ))}
                            </datalist>
                        </td>
                        <td className='align-items-center text-end'>
                            <Button
                                variant="outline-primary"
                                className='p-0 px-1'
                                onClick={handleAddStudent}
                            >
                                <PersonPlus />
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>) : (<></>)
}

export default StudentsList