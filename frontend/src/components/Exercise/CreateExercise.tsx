import { Breadcrumb, Button, Container, Form } from 'react-bootstrap'
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useCreateExerciseMutation } from '../../features/courses/exerciseApiSlice'
import { useGetSessionQuery } from '../../features/courses/sessionApiSlice'
import { useState } from 'react'

const CreateExercise = () => {

    const [title, setTitle] = useState("New exercise")
    const [description, setDescription] = useState("")


    const [errMsg, setErrMsg] = useState("")
    const [createExercise] = useCreateExerciseMutation();
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const session_id: number = Number(searchParams.get("session_id"))

    const {
        data: session,
        isSuccess: sessionIsSuccess,
    } = useGetSessionQuery({ id: session_id });

    useEffect(() => {
        setErrMsg("")
    }, [title, description])

    const handleTitleInput = (e: any) => {
        setTitle(e.target.value ? e.target.value : "New exercise")
    }

    const goBack = () => {
        navigate(-1)
    }

    const handleDescriptionInput = (e: any) => {
        setDescription(e.target.value)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (title && description) {
            try {
                //Create session
                const newExercise: any = await createExercise({
                    title,
                    description,
                    session_id
                }).unwrap()
                //Redirect to new exercise
                navigate(`/exercise/${newExercise?.id}`)
            } catch (err) {
                setErrMsg("An error occured while trying to create exercise.")
            }
        }
        else {
            setErrMsg("Please fill all fields.")
        }
    }

    return sessionIsSuccess ? (
        <Container className="container d-flex flex-column align-items-center vh-100">

            <Container>
                <Breadcrumb>
                    <Breadcrumb.Item href="/course">
                        Courses
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href={"/course/" + session?.course?.id}>
                        {session?.course?.title}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href={"/session/" + session?.id}>
                        {session?.title}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        {title}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </Container>

            <Container className='p-3'>
                <Button variant="light mb-3" onClick={goBack}>
                    ← Back to course
                </Button>

                <h1
                    className={title === "New exercise" ? "text-muted fw-bold" : "fw-bold"}
                >
                    {title}
                </h1>

                <p className='text-danger'>{errMsg}</p>

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Exercise title</Form.Label>
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
                        <Form.Label>Exercise description <span className='text-muted'></span></Form.Label>
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

export default CreateExercise