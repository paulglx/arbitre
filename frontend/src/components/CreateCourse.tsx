import React, { useEffect } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useState } from 'react'
import { useCreateCourseMutation } from '../features/courses/courseApiSlice'

const CreateCourse = () => {

    const [title, setTitle] = useState("New course")
    const [description, setDescription] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [createCourse] = useCreateCourseMutation()

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
                await createCourse({title, description}).unwrap()
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
                            <Form.Label>Course description</Form.Label>
                            <Form.Control
                                value={description}
                                as="textarea"
                                rows={5}
                                placeholder="Enter description"
                                className={errMsg ? 'is-invalid' : ''}
                                onChange={handleDescriptionInput}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Form>
                </Container>
        </Container>)
}

export default CreateCourse