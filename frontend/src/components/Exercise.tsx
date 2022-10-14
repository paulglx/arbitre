import { useParams } from "react-router-dom";

import { useGetExerciseQuery } from "../features/courses/exerciseApiSlice";
import { useGetSessionQuery } from "../features/courses/sessionApiSlice";
import { useGetCourseQuery } from "../features/courses/courseApiSlice";

import { Container, Navbar, ListGroup } from "react-bootstrap";

const Exercise = () => {

    const { id }:any = useParams();

    const {
        data: exercise,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetExerciseQuery({id});

    const {
        data: session,
        isLoading: sessionIsLoading,
        isSuccess: sessionIsSuccess,
        isError: sessionIsError,
        error: sessionError
    } = useGetSessionQuery({id});

    const {
        data: course,
        isLoading: courseIsLoading,
        isSuccess: courseIsSuccess,
        isError: courseIsError,
        error: courseError
    } = useGetCourseQuery({id});

    console.log(exercise, session)

    return isLoading || sessionIsLoading || courseIsLoading ? (
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
    </Container>
    )
}

export default Exercise