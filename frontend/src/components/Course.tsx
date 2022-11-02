import { Breadcrumb, Button, Container, Form, ListGroup, OverlayTrigger, Popover } from "react-bootstrap";
import { useDeleteCourseMutation, useGetCourseQuery, useUpdateCourseMutation } from "../features/courses/courseApiSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "./Header";
import ReactMarkdown from "react-markdown";
import { selectIsTeacher } from "../features/auth/authSlice";
import { useGetSessionsOfCourseQuery } from "../features/courses/sessionApiSlice";
import { useSelector } from "react-redux";

const Course = () => {

    const [deleteCourse] = useDeleteCourseMutation();
    const [description, setDescription] = useState("");
    const [editDescription, setEditDescription] = useState(false);
    const [editTitle, setEditTitle] = useState(false);
    const [title, setTitle] = useState("");
    const [updateCourse] = useUpdateCourseMutation();
    const { id }:any = useParams();
    const isTeacher = useSelector(selectIsTeacher);
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                if(editTitle) {
                    (event.target as HTMLElement).blur();
                }
            }
            if (event.key === 'Escape') {
                //TODO revert to previous state
                (event.target as HTMLElement).blur();
            }
        });
    });

    const {
        data: course,
        isLoading: courseIsLoading,
        isSuccess: courseIsSuccess,
        isError: courseIsError,
        error: courseError
    } = useGetCourseQuery({id});

    useEffect(() => {
        setTitle(course?.title);
        setDescription(course?.description);
    }, [course, courseIsSuccess]);

    const {
        data: sessions,
        isLoading: sessionsIsLoading,
        isSuccess: sessionsIsSuccess,
        isError: sessionsIsError,
        error: sessionsError
    } = useGetSessionsOfCourseQuery({course_id:id})

    const handleUpdate = () => {
        try {
            updateCourse({
                id: course?.id,
                title,
                description
            });
        } catch (e) {
            console.log(e);
        }
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
            <Button id="confirm-delete" onClick={handleDelete} type="submit" size="sm" variant="danger">Delete course</Button>
            </Popover.Body>
        </Popover>
    )

    // Show title or edit title
    const titleContent = () => {
        if (!isTeacher || !editTitle) {
            return (
                <h1
                    className={"h2 fw-bold p-2" + (isTeacher ? " teacher editable-title" : "")}
                    id="title-editable"
                    onFocus={() => isTeacher ? setEditTitle(true) : null}
                    tabIndex={0} //allows focus
                >
                    {title}
                </h1>
            );
        } else if (isTeacher && editTitle) {
            return (
                <input
                    autoComplete="false"
                    autoFocus
                    className="teacher title-input h2 fw-bold p-2"
                    id="title-input"
                    onBlur={() => {
                        if (title === "") {
                            setTitle("Untitled course");
                        }
                        setEditTitle(false)
                        handleUpdate();
                    }}
                    onChange={(e:any) => setTitle(e.target.value)}
                    placeholder="Enter course title"
                    type="text"
                    value={title} 
                />
            )
        }
    }

    // Show description or edit description
    // TODO implement ctrl+z
    const descriptionContent = () => {
        if (!isTeacher || !editDescription) {
            return (
                <blockquote
                    className={"p-3 pb-1 bg-light rounded" + (isTeacher ? " teacher editable-description" : "")}
                    onFocus={() => setEditDescription(true)}
                    tabIndex={0} //allows focus
                >
                    <ReactMarkdown
                        children={description}
                        className="markdown"
                    />
                </blockquote>
            )
        } else if (isTeacher && editDescription) {
            return (
                <Form>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Control
                            as="textarea"
                            autoFocus
                            className="teacher description-input"
                            onBlur={() => {
                                if(description === "") {
                                    setDescription("No description");
                                }
                                setEditDescription(false);
                                handleUpdate();
                            }}
                            onChange={(e:any) => setDescription(e.target.value)}
                            placeholder="Enter course description. Markdown is supported."
                            rows={Math.max(2, description.split(/\r\n|\r|\n/).length)} // Display as many rows as description has lines (minimum 2 rows).
                            value={description}
                        />
                        <Form.Text className="text-muted">
                            You are editing the description - Markdown supported !
                        </Form.Text>
                    </Form.Group>
                </Form>
            )
        }
    }

    // Delete button (teacher only)
    const teacherActionsContent = () => {
        return isTeacher ? (
            <div className="d-flex justify-content-end">
                <OverlayTrigger trigger="click" rootClose={true} placement="auto" overlay={deletePopover}>
                    <Button variant="light border border-danger text-danger" id="delete-button">Delete</Button>
                </OverlayTrigger>
            </div>
        ) : <></>
    }

    //Create session button (teacher only)
    const sessionListTeacherContent = () => {
        return isTeacher ? (
            <ListGroup.Item id="create-session" action href={"/session/create?course_id="+id}>
                        + Create Session
            </ListGroup.Item>
        ) : (<></>)
    }

    //Create session button, on "no sessions" block (teacher only)
    const sessionListTeacherContentNoSessions = () => {
        return isTeacher ? (
            <Button id="create-session-no-sessions" variant="light mb-3 border" href={"/session/create?course_id="+id}>
                + Create session
            </Button>
        ) : (<></>)
    }

    //Session list, or "no sessions" block if no sessions
    const sessionContent = () => {
        if (sessionsIsLoading) {
            return (
                <p>Loading sessions...</p>
            )
        }
        else if (sessionsIsSuccess && sessions.length === 0) {
            return (
                <ListGroup>
                    <ListGroup.Item id="no-sessions-warning" className="text-muted text-center dashed-border">
                        <br />
                        <p>This course doesn't have any sessions.</p>
                        {sessionListTeacherContentNoSessions()}
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
                {sessionListTeacherContent()}
                </ListGroup>
            )
        }
    }

    //Session not found or not authorized
    if(courseIsError || sessionsIsError) {
        return isTeacher ? (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The course you are looking for doesn't exist, <br />or you aren't allowed to access it.<br/><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        ) : (<></>)
    }

    //Main content
    return courseIsLoading ? (
        <></>
    ) : (
    <>
        <Header />

            <Container className="mb-3">

                <Breadcrumb>
                    <Breadcrumb.Item href="/course">
                        Courses
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        {title}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <br />

                <div className="d-flex align-items-center justify-content-between">
                    {titleContent()}
                    <div className="p-0 mb-2">
                        {teacherActionsContent()}
                    </div>
                </div>
                
                {descriptionContent()}

                <hr />

                <h2>Sessions</h2>
                {sessionContent()}

            </Container>
        </>
    )
}

export default Course