import '../join-code.css'

import { Button, Container, Form } from 'react-bootstrap'
import { useEffect, useState } from 'react'

import Header from './Header'
import { pushNotification } from '../features/notification/notificationSlice';
import useDigitInput from 'react-digit-input';
import { useDispatch } from 'react-redux';
import { useJoinCourseWithCodeMutation } from '../features/courses/courseApiSlice';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'

const JoinCourse = (props: any) => {

    const [codeInput, setCodeInput] = useState<any>('')
    const [err, setErr] = useState<any>("")
    const [joinCourseWithCode] = useJoinCourseWithCodeMutation()
    const { join_code: join_code_parameter } = useParams<{ join_code: string }>()
    const dispatch = useDispatch()
    const navigate = useNavigate()

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

            <br /><br />

            <Container className='p-3'>

                <Button variant="light mb-3" href="/course">
                    ← Back to courses
                </Button>

                <br /><br />

                <h1 className='fw-bold'>Join a course</h1>
                <hr />
                {err === "" ?
                    <p className='text-muted'>Enter the 8 character course code to join a course.</p>
                    :
                    <p className='text-danger'>{err}</p>
                }

                <Form className="jc-input-group">
                    {Array(8).fill(0).map((_, i: number) => (
                        <input
                            type="text"
                            placeholder='X'
                            key={i}
                            autoFocus={i === 0}
                            className={err === "" ? "" : "jc-input-error"}
                            {...digits[i]}
                        />
                    ))}
                </Form>

                <br />

                <Button
                    variant='primary'
                    disabled={codeInput.replace(" ", "").length < 8}
                    onClick={(e: any) => handleSubmit(e)}
                >
                    Join
                </Button>

            </Container>
        </>
    )
}

export default JoinCourse