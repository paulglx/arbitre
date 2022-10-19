import { useParams } from "react-router-dom";
import { useGetCourseQuery } from "../features/courses/courseApiSlice";
import { useGetSessionsOfCourseQuery } from "../features/courses/sessionApiSlice";
import { Container, Navbar, ListGroup, Breadcrumb } from "react-bootstrap";
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

            <Breadcrumb>
                <Breadcrumb.Item href="/courses">
                    Courses
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    {course.title}
                </Breadcrumb.Item>
            </Breadcrumb>

            <br />

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
    </>)
}

export default Course