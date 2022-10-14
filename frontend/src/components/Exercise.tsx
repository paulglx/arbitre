import { useParams } from "react-router-dom";
import { useGetExerciseQuery } from "../features/courses/exerciseApiSlice";
import { useCreateSubmissionMutation } from "../features/submission/submissionApiSlice";
import { Container, Navbar, Form, Button } from "react-bootstrap";
import { store } from "../app/store";

const Exercise = () => {

    const { id }:any = useParams();

    const {
        data: exercise,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetExerciseQuery({id});

    const session = exercise?.session
    const course = session?.course

    const [createSubmission] = useCreateSubmissionMutation();

    const handleSubmit = async (e : any) => {
        e.preventDefault();

        console.log(e);

        const form=e.target[0];
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        console.log(form.files[0])
        
        var formData = new FormData();
        formData.append("exercise", exercise.id)
        formData.append("file", form.files[0])
        formData.append("owner", '1')
        
        console.log("(create submission) Data to send:", formData)

        const createSubmissionResponse = await createSubmission(formData).unwrap()

        console.log("Response:",createSubmissionResponse)

    }

    return isLoading ? (
        <p>Loading...</p>
    ):(
    <Container>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href={"/course/"+course.id}>{course.title}</Navbar.Brand> {session.title}
            </Container>
        </Navbar>

        <br />

        <Container>
            <h1>{exercise.title}</h1>
            <blockquote>
                {exercise.description}
            </blockquote>
        </Container>

        <br />

        <h4>Submit your work</h4>
        <Form className="submission p-4 border rounded bg-light" onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Submission file</Form.Label>
                <Form.Control required type="file" name="file"/>
                <Form.Text className="text-muted">You are logged in as <u>John Doe</u></Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>

    </Container>
    )
}

export default Exercise