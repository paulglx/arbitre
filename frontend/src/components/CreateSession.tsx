import React, { useEffect } from 'react'
import { Breadcrumb, Button, Container, Form } from 'react-bootstrap'
import { useState } from 'react'
import { useCreateSessionMutation } from '../features/courses/sessionApiSlice'
import { useGetCourseQuery } from '../features/courses/courseApiSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'

const CreateSession = () => {

    const [title, setTitle] = useState("New session")
    const [description, setDescription] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [createSession] = useCreateSessionMutation()
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const course_id:number = Number(searchParams.get("course_id"))

    const {
        data: course,
        isLoading: courseIsLoading,
        isSuccess: courseIsSuccess,
        isError: courseIsError,
        error: courseError
    } = useGetCourseQuery({id:course_id});

    useEffect(() => {
        setErrMsg("")
    }, [title, description])

    const handleTitleInput = (e:any) => {
        setTitle(e.target.value ? e.target.value : "New session")
    }

    const goBack = () => {
        navigate(-1)
    }

    const handleDescriptionInput = (e:any) => {
        setDescription(e.target.value)
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if(title && description) {
            try {
                console.log(title, description, course_id)
                //Create session
                await createSession({
                    title,
                    description,
                    course_id
                }).unwrap()
                //Redirect to sessions page
                navigate("/session")
            } catch (err) {
                console.log(err)
                setErrMsg("An error occured while trying to create session.")
            }
        }
        else {
            setErrMsg("Please fill all fields.")
        }
    }

    return courseIsSuccess ? (
        <Container className="container d-flex flex-column align-items-center vh-100">

            <Container>
                <Breadcrumb>
                    <Breadcrumb.Item href="/course">
                        Courses
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href={"/course/"+course.id}>
                        {course.title}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </Container>

                <Container className='p-3'>
                    <Button variant="light mb-3" onClick={goBack}>
                        ← Back to course
                    </Button>

                    <h1
                        className={title === "New session" ? "text-muted fw-bold" : "fw-bold"}
                        >
                        {title}
                    </h1>

                    <p className='text-danger'>{errMsg}</p>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Session title</Form.Label>
                            <Form.Control 
                                type="text"
                                placeholder="Enter title"
                                onChange={handleTitleInput}
                                autoComplete='off'
                                className={errMsg ? 'is-invalid' : ''}
                                required
                            />
                            <Form.Text className="text-muted">
                                Give a short title to your session.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Session description <span className='text-muted'></span></Form.Label>
                            <Form.Control
                                value={description}
                                as="textarea"
                                rows={5}
                                placeholder="Enter description"
                                className={errMsg ? 'is-invalid' : ''}
                                onChange={handleDescriptionInput}
                            />
                            <Form.Text className="text-muted">
                                Markdown supported !&nbsp;
                                <a className='text-muted' href="https://www.markdownguide.org/basic-syntax/">See reference</a>
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="submit" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Form>
                </Container>
        </Container>) : (<></>)
}

export default CreateSession