import { useParams } from "react-router-dom";
import { useGetExerciseQuery } from "../features/courses/exerciseApiSlice";
import { useCreateSubmissionMutation } from "../features/submission/submissionApiSlice";
import { Container, Navbar, Form, Button, Breadcrumb } from "react-bootstrap";
import Header from "./Header";
import TestResult from "./TestResult";

const Exercise = () => {

    const { exercise_id } : any = useParams();

    const {
        data: exercise,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetExerciseQuery({id:exercise_id});

    const session = exercise?.session
    const course = session?.course

    const [createSubmission] = useCreateSubmissionMutation();

    const handleSubmit = async (e : any) => {
        e.preventDefault();

        const form=e.target[0];
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        
        var formData = new FormData();
        formData.append("exercise", exercise.id)
        formData.append("file", form.files[0])
        formData.append("owner", '1')

        await createSubmission(formData).unwrap()

    }

    return isLoading ? (
        <></>
    ):(<>

    <Header />

    <Container>

        <Container>
            <Breadcrumb>
                <Breadcrumb.Item href={"/course/"+course.id}>
                    {course.title}
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    {session.title}
                </Breadcrumb.Item>
            </Breadcrumb>
        </Container>

        <Container>
            <h1>{exercise.title}</h1>
            <blockquote>
                {exercise.description}
            </blockquote>
        </Container>

        <br />

        <Container className="w-75 p-3">

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

        <br />
        
        <TestResult />

        </Container>

    </Container>
    </>)
}

export default Exercise