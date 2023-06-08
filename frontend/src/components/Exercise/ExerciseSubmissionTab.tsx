import { Button, Form } from 'react-bootstrap'

import React from 'react'
import TestResult from '../Dashboard/TestResult'
import { useCreateSubmissionMutation } from "../../features/submission/submissionApiSlice";

const ExerciseSubmissionTab = (props: any) => {

    const { exercise, username } = props

    const [createSubmission] = useCreateSubmissionMutation();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const form = e.target[0];
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        const formData = new FormData();
        formData.append("exercise", exercise.id)
        formData.append("file", form.files[0])

        await createSubmission(formData).unwrap()

        // refresh page
        window.location.reload(); //TODO update state instead
    }

    return (<>
        <Form className="submission p-4 border rounded bg-light" onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Submission file</Form.Label>
                <Form.Control required type="file" name="file" />
                <Form.Text className="text-muted">You are logged in as <u>{username}</u></Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
        <br />
        <TestResult exercise_id={exercise.id} />
    </>)
}

export default ExerciseSubmissionTab