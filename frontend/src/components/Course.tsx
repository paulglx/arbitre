import { useParams } from "react-router-dom";
import { useGetCourseQuery } from "../features/courses/courseApiSlice";
import { useGetSessionsOfCourseQuery } from "../features/courses/sessionApiSlice";
import { Container, ListGroup, Breadcrumb } from "react-bootstrap";
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

    if(courseIsError || sessionsIsError) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The course you are looking for doesn't exist, <br />or you aren't allowed to access it.<br/><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        )
    }

    return courseIsLoading || sessionsIsLoading ? (
        <></>
    ):(<>

    <Header />

        <Container>

            <Breadcrumb>
                <Breadcrumb.Item href="/course">
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
                {sessions.map((session:any, i:number) => {
                    return <ListGroup.Item
                        action
                        variant="light"
                        href={"/session/"+session.id}
                        key={i}
                    >
                        {session.title}
                    </ListGroup.Item>
                })}
            </ListGroup>

        </Container>
    </>)
}

export default Course