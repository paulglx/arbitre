import React from 'react'
import { Container, Form } from 'react-bootstrap'
import { useState } from 'react'

const CreateCourse = () => {

    const [title, setTitle] = useState("New course")

    const handleTitleInput = (e:any) => {
        setTitle(e.target.value ? e.target.value : "New course")
    }

    return (
        <Container className="d-flex align-items-center vh-100">
            <Container>

                <h1>{title}</h1>

                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
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
                </Form>

                <Form.Group>
                    <Form.Label>Course description</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                </Form.Group>
            </Container>
        </Container>
    )
}

export default CreateCourse