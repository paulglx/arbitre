import { UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { useAddStudentMutation, useGetStudentsQuery, useRemoveStudentMutation } from '../../../features/courses/courseApiSlice'
import { useEffect, useState } from 'react'

import { useGetUsersQuery } from '../../../features/users/usersApiSlice'

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
  };


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
    <div className="bg-gray-200 p-5 md:p-10 rounded-3xl">
      <table className="w-full mb-0">
        <thead className="bg-light">
          <tr>
            <th className="px-5 text-left">Student</th>
            <th className="text-right pr-5">Action</th>
          </tr>
        </thead>
        <tbody className="border-t-2 md:border-t-4 border-gray-500">
          {students.length > 0 ? (
            students.map((student: any, i: number) => (
              <tr key={i} className="border-b border-gray-500">
                <td className="py-3">{student.username}</td>
                <td className="text-right pr-5">
                  <button
                    className="p-0 text-red-500 hover:text-red-600 transition-colors duration-300"
                    onClick={() => handleRemoveStudent(student.id)}
                    aria-label="Remove student"
                  >
                    <UserMinusIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-5 text-center bg-light" colSpan={2}>
                There are no students in this course yet. <br />
                <span className="text-gray-500">
                  Add students by providing them with the course code or entering their username below.
                </span>
              </td>
            </tr>
          )}
          <tr>
            <td className="py-3">
              <div className="flex rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder="Enter student username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                  value={studentToAdd}
                  onChange={(e) => setStudentToAdd(e.target.value)}
                  aria-label="Add student"
                  list="studentOptions"
                />
                <datalist id="studentOptions">
                  {addableStudents &&
                    addableStudents.map((u: any, i: number) => (
                      <option key={i} value={u.username} />
                    ))}
                </datalist>
              </div>

            </td>
            <td className='flex justify-end py-2'>
              <button
                className="flex items-center px-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-12 h-12"
                onClick={handleAddStudent}
                aria-label="Add student"
              >
                <UserPlusIcon className="w-5 h-5" />
              </button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <></>
  );

}

export default StudentsList