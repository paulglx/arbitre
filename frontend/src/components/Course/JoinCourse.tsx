import '../../join-code.css'

import { useEffect, useState } from 'react'

import Header from '../Common/Header'
import { pushNotification } from '../../features/notification/notificationSlice';
import useDigitInput from 'react-digit-input';
import { useDispatch } from 'react-redux';
import { useJoinCourseWithCodeMutation } from '../../features/courses/courseApiSlice';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import {Link} from "react-router-dom";


const JoinCourse = (props: any) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { join_code: join_code_parameter } = useParams<{ join_code: string }>()
    const [joinCourseWithCode] = useJoinCourseWithCodeMutation()
    const [err, setErr] = useState<any>("")
    const [codeInput, setCodeInput] = useState<any>('')

    const handleCodeInput = (value: any) => {
        setErr("")
        setCodeInput(value.toUpperCase())
    }

    const digits = useDigitInput({
        acceptedCharacters: /^[a-zA-Z0-9]$/,
        length: 8,
        value: codeInput,
        onChange: handleCodeInput,
    });

    const handleSubmit = async (e: any) => {

        e.preventDefault()

        try {
            setCodeInput(codeInput.toUpperCase())
            const response = await joinCourseWithCode({ join_code: codeInput }).unwrap()
            dispatch(pushNotification({
                message: "You have successfully joined the course.",
                type: "success"
            }))
            navigate(`/course/${response.course_id}`)

        } catch (err: any) {
            if (err.data.course_id) {
                dispatch(pushNotification({
                    message: "You are already in this course.",
                    type: "warning"
                }))
                navigate(`/course/${err.data.course_id}`)
                return
            }
            setErr(err.data.message)
        }
    }

    useEffect(() => {

        async function joinCourse(code: string) {
            try {
                setCodeInput(code.toUpperCase())
                const response = await joinCourseWithCode({ join_code: code }).unwrap()
                navigate(`/course/${response.course_id}`)
            } catch (err: any) {
                if (err.data.course_id) {
                    navigate(`/course/${err.data.course_id}`)
                    return
                }
                setErr(err.data.message)
            }
        }


        if (join_code_parameter) {

            if (join_code_parameter.length !== 8) {
                setErr("Invalid join link.")
                navigate("/course/join")
                return
            }
            setCodeInput(join_code_parameter)

            joinCourse(join_code_parameter)

        }
    }, [join_code_parameter, joinCourseWithCode, navigate])

    return (
        <>
          <Header />
    
          <br />
          <br />

          <div className="container mx-auto">
            <Link to="/course" className="inline-flex bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline items-center my-4 md:my-6">
                <ChevronLeftIcon className="h-5 w-5" /> 
                    Back to courses
            </Link>
        
            <div className="bg-gray-200 rounded-xl md:rounded-3xl shadow-lg shadow-gray-400/50 p-4 md:p-6 md:h-auto h-5/6 w-full  flex flex-col items-center justify-center">
        
                <h1 className="text-4xl font-bold mb-4 text-gray-700 hidden md:block">Join a course</h1>
                <hr />
                {err === '' ? (
                <p className="text-gray-600 hidden md:block m-2">Enter the 8 character course code to join a course.</p>
                ) : (
                <p className="text-red-500">{err}</p>
                )}
        
                <form className="jc-input-group m-2 md:n-4 bg-slate-50 rounded-xl md:rounded-3xl shadow-lg shadow-gray-400/50  p-4 md:p-6 w-5/6 overflow-x-auto flex md:justify-center">
                {Array(8)
                    .fill(0)
                    .map((_, i) => (
                        <input
                        type="text"
                        placeholder="X"
                        key={i}
                        autoFocus={i === 0}
                        className="w-1 h-2 md:w-2 md:h-4 p-0 text-gray-500 placeholder-gray-400 border border-gray-400"
                        {...digits[i]}
                        onChange={(e) => handleCodeInput(e.target.value)}
                    />
                    ))}
                </form>
        
                <br />
        
                <button
                className="block bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded pl-6 pr-6 p-4 hover:bg-gray-100 transition duration-300 rounded-lg justify-center flex items-center"
                disabled={codeInput.replace(' ', '').length < 8}
                onClick={handleSubmit}
                >
                Join
                </button>
            </div>
        </div>
        </>
    )
}

export default JoinCourse