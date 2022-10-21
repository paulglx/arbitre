import React from 'react'
import { Container, Form } from 'react-bootstrap'

const CreateCourse = () => {
  return (
    <Container>
        <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Course title</Form.Label>
                <Form.Control type="text" placeholder="Enter title" />
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
  )
}

export default CreateCourse