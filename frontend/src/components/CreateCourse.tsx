import React from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useState } from 'react'
import {ArrowLeftIcon} from '@primer/octicons-react'

const CreateCourse = () => {

    const [title, setTitle] = useState("New course")

    const handleTitleInput = (e:any) => {
        setTitle(e.target.value ? e.target.value : "New course")
    }

    return (
        <Container className="d-flex align-items-center vh-100">
            <Container className="text-wrap text-break">

                <Button variant="light mb-3" href="/course">
                    ← Back to courses
                </Button>

                <h1
                    className={title === "New course" ? "text-muted fw-bold" : "fw-bold"}
                    >
                    {title}
                </h1>

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Course title</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter title"
                            onChange={handleTitleInput}
                            autoComplete='off'
                            required
                        />
                        <Form.Text className="text-muted">
                            Give a short title to your course.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Course description</Form.Label>
                        <Form.Control as="textarea" rows={5} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>

            </Container>
        </Container>
    )
}

export default CreateCourse