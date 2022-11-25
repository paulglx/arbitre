import { Button, Container, Form } from 'react-bootstrap'
import React, { useEffect } from 'react'

import { useCreateCourseMutation } from '../features/courses/courseApiSlice'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const CreateCourse = () => {

    const [title, setTitle] = useState("New course")
    const [description, setDescription] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [createCourse] = useCreateCourseMutation()
    const navigate = useNavigate()

    useEffect(() => {
        setErrMsg("")
    }, [title, description])

    const handleTitleInput = (e:any) => {
        setTitle(e.target.value ? e.target.value : "New course")
    }

    const handleDescriptionInput = (e:any) => {
        setDescription(e.target.value)
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if(title && description) {
            try {
                //Create course
                const newCourse:any = await createCourse({title, description}).unwrap()
                //Redirect to courses page
                navigate(`/course/${newCourse?.id}`)
            } catch (err) {
                console.log(err)
                setErrMsg("An error occured while trying to create course.")
            }
        }
        else {
            setErrMsg("Please fill all fields.")
        }
    }

    return (
        <Container className="container-fluid d-flex align-items-center vh-100">
                <Container className='p-3'>
                    <Button variant="light mb-3" href="/course">
                        ← Back to courses
                    </Button>

                    <h1
                        className={title === "New course" ? "text-muted fw-bold" : "fw-bold"}
                        >
                        {title}
                    </h1>

                    <p className='text-danger'>{errMsg}</p>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Course title</Form.Label>
                            <Form.Control 
                                type="text"
                                placeholder="Enter title"
                                onChange={handleTitleInput}
                                autoComplete='off'
                                className={errMsg ? 'is-invalid' : ''}
                                required
                            />
                            <Form.Text className="text-muted">
                                Give a short title to your course.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Course description <span className='text-muted'></span></Form.Label>
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
                            Create course
                        </Button>
                    </Form>
                </Container>
        </Container>)
}

export default CreateCourse