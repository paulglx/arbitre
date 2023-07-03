import { UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { useAddStudentMutation, useGetStudentsQuery, useRemoveStudentMutation } from '../../../features/courses/courseApiSlice'
import { useEffect, useState } from 'react'

import { pushNotification } from '../../../features/notification/notificationSlice'
import { useDispatch } from 'react-redux'
import { useGetUsersQuery } from '../../../features/users/usersApiSlice'

const StudentsList = (props: any) => {

  const [addableStudents, setAddableStudents] = useState<any>([])
  const [addStudent] = useAddStudentMutation()
  const [allUsers, setAllUsers] = useState<any>([])
  const [removeStudent] = useRemoveStudentMutation()
  const [students, setStudents] = useState<any>([])
  const [studentToAdd, setStudentToAdd] = useState<any>("")
  const course = props.course
  const dispatch = useDispatch()

  const {
    data: studentsData,
    isSuccess: studentsSuccess,
  } = useGetStudentsQuery({ course_id: course.id })

  const {
    data: usersData,
    isSuccess: usersSuccess,
  } = useGetUsersQuery({})

  const handleAddStudent = async () => {

    if (!allUsers.find((u: any) => u.username === studentToAdd)) {
      dispatch(pushNotification({
        message: "User does not exist",
        type: "error"
      }))
      return
    }

    const user_id = allUsers.find((u: any) => u.username === studentToAdd).id

    if (students.find((s: any) => s.id === user_id)) {
      dispatch(pushNotification({
        message: "Student is already in the course",
        type: "error"
      }))
      return
    }

    await addStudent({ course_id: course.id, user_id }).catch((e) => {
      console.log(e)
      dispatch(pushNotification({
        message: "Failed to add student",
        type: "error"
      }))
    }).finally(() => {
      setStudents([...students, { id: user_id, username: studentToAdd }])
      setStudentToAdd("")
    })
  };

  const handleRemoveStudent = async (user_id: number) => {
    await removeStudent({ course_id: course.id, user_id: user_id })
    setStudents(students.filter((s: any) => s.id !== user_id))
  }

  useEffect(() => {
    if (studentsSuccess) {
      const studentsToSort = structuredClone(studentsData.students)
      const sortedStudents = studentsToSort.sort((a: any, b: any) => { return a.username.localeCompare(b.username) })
      setStudents(sortedStudents)
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
    <div className='mx-auto border overflow-x-auto rounded-lg mb-3'>
      <table className="w-full text-sm rounded-lg">
        <tbody className="">
          {students.length > 0 ? (
            students.map((student: any, i: number) => (
              <tr key={i} className="border-t first:border-t-0 hover:bg-gray-50">
                <td className="px-3 py-3">{student.username}</td>
                <td className="text-right pr-3">
                  <button
                    className=" text-red-500 hover:text-red-600 bg-gray-50 hover:bg-gray-100 border hover:border-red-300 transition-colors duration-300 align-middle p-1 rounded-md"
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
          <tr className='border-t bg-gray-50'>
            <td className="py-3">
              <div className="flex rounded-md">
                <input
                  aria-label="Add student"
                  className="w-full ml-2 px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                  list="studentOptions"
                  onChange={(e) => setStudentToAdd(e.target.value)}
                  placeholder="Enter student username"
                  type="text"
                  value={studentToAdd}
                />
                <datalist id="studentOptions">
                  {addableStudents &&
                    addableStudents.map((u: any, i: number) => (
                      <option key={i} value={u.username} />
                    ))}
                </datalist>
              </div>
            </td>
            <td className='flex justify-end pt-3 pr-3'>
              <button
                className={`${studentToAdd ? "bg-gray-50" : "bg-gray-200"} align-middle border p-1 rounded-md flex items-center text-gray-60 border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={!studentToAdd}
                onClick={handleAddStudent}
                aria-label="Add student"
              >
                <UserPlusIcon className={`w-5 h-5 ${studentToAdd ? "text-gray-900" : "text-gray-400"}`} />
              </button>
            </td>
          </tr>
        </tbody>
      </table >
    </div >
  ) : (
    <></>
  );

}

export default StudentsList