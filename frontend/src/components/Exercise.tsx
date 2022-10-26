import { useParams } from "react-router-dom";
import { useGetExerciseQuery } from "../features/courses/exerciseApiSlice";
import { useCreateSubmissionMutation } from "../features/submission/submissionApiSlice";
import { Container, Navbar, Form, Button, Breadcrumb } from "react-bootstrap";
import store from "../app/store";
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
    const username = store.getState().auth?.user;

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

        await createSubmission(formData).unwrap()

    }

    if(isError) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The exercise you are looking for doesn't exist, <br />or you aren't allowed to access it.<br/><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        )
    }

    return isLoading ? (
        <></>
    ):(<>

    <Header />

    <Container>

        <Breadcrumb>
            <Breadcrumb.Item href="/course">
                Courses
            </Breadcrumb.Item>
            <Breadcrumb.Item href={"/course/"+course.id}>
                {course.title}
            </Breadcrumb.Item>
            <Breadcrumb.Item href={"/session/"+session.id}>
                {session.title}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
                {exercise.title}
            </Breadcrumb.Item>
        </Breadcrumb>

        <br />

        <Container>
            <h1>{exercise.title}</h1>
            <blockquote>
                {exercise.description}
            </blockquote>
        </Container>

        <br />

        <Container className="w-75 p-3">

        <h2 className="h4">Submit your work</h2>
        <Form className="submission p-4 border rounded bg-light" onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Submission file</Form.Label>
                <Form.Control required type="file" name="file"/>
                <Form.Text className="text-muted">You are logged in as <u>{username}</u></Form.Text>
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