import { useParams } from "react-router-dom";
import { useGetSessionQuery } from "../features/courses/sessionApiSlice";
import { useGetExercisesOfSessionQuery } from "../features/courses/exerciseApiSlice";
import { Container, Navbar, ListGroup, Breadcrumb } from "react-bootstrap";
import Header from "./Header";

const Session = () => {

    const { id }:any = useParams();

    const {
        data: session,
        isLoading: sessionIsLoading,
        isSuccess: sessionIsSuccess,
        isError: sessionIsError,
        error: sessionError
    } = useGetSessionQuery({id});

    const {
        data: exercises,
        isLoading: exercisesIsLoading,
        isSuccess: exercisesIsSuccess,
        isError: exercisesIsError,
        error: exercisesError
    } = useGetExercisesOfSessionQuery({id});

    const course = session?.course

    return sessionIsLoading || exercisesIsLoading  ? (
        <></>
    ):(<>

    <Header />
        
    <Container>
            <Breadcrumb>
                <Breadcrumb.Item href="/courses">
                    Courses
                </Breadcrumb.Item>
                <Breadcrumb.Item href={"/course/"+course.id}>
                    {course.title}
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    {session.title}
                </Breadcrumb.Item>
            </Breadcrumb>
        </Container>

        <br />

        <Container>
            <h1>{session.title}</h1>
            <blockquote>
                {session.description}
            </blockquote>

            <h2>Exercises</h2>
            <ListGroup>
                {exercises.map((exercise:any) => {
                    return <ListGroup.Item
                        action
                        variant="light"
                        href={"/exercise/"+exercise.id}
                    >
                        {exercise.title}
                    </ListGroup.Item>
                })}
            </ListGroup>

        </Container>
    </>)
}

export default Session