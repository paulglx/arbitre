import { Container, ListGroup, Breadcrumb, Button, Popover, OverlayTrigger } from "react-bootstrap";
import { selectCurrentRoles } from "../features/auth/authSlice";
import { useGetCourseQuery, useDeleteCourseMutation } from "../features/courses/courseApiSlice";
import { useGetSessionsOfCourseQuery } from "../features/courses/sessionApiSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";
import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';

const Course = () => {

    const { id }:any = useParams();
    const roles = useSelector(selectCurrentRoles);
    const [deleteCourse] = useDeleteCourseMutation();
    const navigate = useNavigate();

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
        return roles?.includes(2) ? (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The course you are looking for doesn't exist, <br />or you aren't allowed to access it.<br/><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        ) : (<></>)
    }

    const handleDelete = (e:any) => {
        e.preventDefault();
        try {
            deleteCourse(id);
            navigate("/course")
        } catch (e) {
            console.log(e);
        }
    }

    const deletePopover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Are you sure?</Popover.Header>
            <Popover.Body>
            This will <strong>remove permanently</strong> this course, all its sessions and all the session's exercises. <br /><br />
            <Button onClick={handleDelete} type="submit" size="sm" variant="danger">Delete course</Button>
            </Popover.Body>
        </Popover>
    )

    const teacherContent = () => {
        return roles?.includes(2) ? (
            <div className="d-flex justify-content-end">
                <Button variant="light border" href={"/course/"+course.id+"/edit"}>Edit</Button> &nbsp;
                <OverlayTrigger trigger="click" placement="auto" overlay={deletePopover}>
                    <Button variant="light border border-danger text-danger">Delete</Button>
                </OverlayTrigger>
            </div>
        ) : <></>
    }

    const sessionContent = () => {
        if (sessionsIsLoading) {
            return (
                <p>Loading sessions...</p>
            )
        }
        else if (sessionsIsSuccess && sessions.length === 0) {
            return (
                <ListGroup>
                    <ListGroup.Item className="text-muted text-center dashed-border">
                        <br />
                        <p>This course doesn't have any sessions.</p>
                        <Button variant="light mb-3 border" href="">
                            + Create session
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            )
        }
        else if (sessionsIsSuccess) {
            return (
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
            )
        }
    }

    return courseIsLoading ? (
        <></>
    ):(<>

    <Header />

        <Container className="mb-3">

            <Breadcrumb>
                <Breadcrumb.Item href="/course">
                    Courses
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    {course.title}
                </Breadcrumb.Item>
            </Breadcrumb>

            <br />

            {teacherContent()}

            <h1>{course.title}</h1>
            <blockquote className="border rounded p-3">
                <ReactMarkdown
                    children={course.description}
                    className="markdown"
                />
            </blockquote>

            <h2>Sessions</h2>
            {sessionContent()}

        </Container>
    </>)
}

export default Course