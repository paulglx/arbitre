import { useParams } from "react-router-dom";
import { useGetCourseQuery } from "../features/courses/courseApiSlice";
import { useGetSessionsOfCourseQuery } from "../features/courses/sessionApiSlice";
import { Container, Navbar, ListGroup } from "react-bootstrap";
import Header from "./Header";

const Course = () => {

    const { id }:any = useParams();

    const {
        data: course,
        isLoading: courseIsLoading,
        isSuccess: courseIsSuccess,
        isError: courseIsError,
        error: courseError
    } = useGetCourseQuery({id});

    const {
        data: sessions,
        isLoading: sessionsIsLoading,
        isSuccess: sessionsIsSuccess,
        isError: sessionsIsError,
        error: sessionsError
    } = useGetSessionsOfCourseQuery({course_id:id})

    return courseIsLoading || sessionsIsLoading  ? (
        <></>
    ):(<>

    <Header />

    <Container>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href={"/course/"+course.id}>{course.title}</Navbar.Brand>
            </Container>
        </Navbar>

        <br />

        <Container>
            <h1>{course.title}</h1>
            <blockquote>
                {course.description}
            </blockquote>

            <h2>Sessions</h2>
            <ListGroup>
                {sessions.map((session:any) => {
                    return <ListGroup.Item
                        action
                        variant="light"
                        href={"/session/"+session.id}
                    >
                        {session.title}
                    </ListGroup.Item>
                })}
            </ListGroup>

        </Container>
    </Container>
    </>)
}

export default Course