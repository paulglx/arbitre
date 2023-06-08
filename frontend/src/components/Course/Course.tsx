import { Breadcrumb, Button, Container, Dropdown, Form, ListGroup, OverlayTrigger, Popover, Tab, Tabs } from "react-bootstrap";
import { selectCurrentUser, selectIsTeacher } from "../../features/auth/authSlice";
import { useDeleteCourseMutation, useGetCourseQuery, useUpdateCourseMutation, useUpdateLanguageMutation } from "../../features/courses/courseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../Header/Header";
import Markdown from "../Util/Markdown";
import Students from "./Students/Students";
import TeacherList from "./Teachers/TeacherList";
import autosize from "autosize";
import { pushNotification } from "../../features/notification/notificationSlice";
import { useGetSessionsOfCourseQuery } from "../../features/courses/sessionApiSlice";

const Course = () => {

    const dispatch = useDispatch();
    const { id }: any = useParams();
    const [updateLanguage] = useUpdateLanguageMutation();
    const [updateCourse] = useUpdateCourseMutation();
    const [title, setTitle] = useState("");
    const [language, setLanguage] = useState("");
    const [editTitle, setEditTitle] = useState(false);
    const [editDescription, setEditDescription] = useState(false);
    const [description, setDescription] = useState("");
    const [deleteCourse] = useDeleteCourseMutation();

    const username = useSelector(selectCurrentUser);
    const navigate = useNavigate();
    const isTeacher = useSelector(selectIsTeacher);

    const languageChoices = [
        ["ada", "Ada"],
        ["c", "C"],
        ["c#", "C#"],
        ["c++", "C++"],
        ["d", "D"],
        ["go", "Go"],
        ["haskell", "Haskell"],
        ["java", "Java"],
        ["javascript", "JavaScript"],
        ["lua", "Lua"],
        ["ocaml", "OCaml"],
        ["pascal", "Pascal"],
        ["perl", "Perl"],
        ["php", "PHP"],
        ["prolog", "Prolog"],
        ["python", "Python"],
        ["ruby", "Ruby"],
        ["rust", "Rust"],
        ["scheme", "Scheme"],
    ]

    const {
        data: course,
        isLoading: courseIsLoading,
        isSuccess: courseIsSuccess,
        isError: courseIsError,
    } = useGetCourseQuery({ id });

    const {
        data: sessions,
        isLoading: sessionsIsLoading,
        isSuccess: sessionsIsSuccess,
        isError: sessionsIsError,
    } = useGetSessionsOfCourseQuery({ course_id: id })

    const ownersUsernames = course?.owners.map((owner: any) => owner.username);
    const isOwner = ownersUsernames?.includes(username);

    const tutorsUsernames = course?.tutors.map((tutor: any) => tutor.username);
    const isTutor = tutorsUsernames?.includes(username);

    // Autosize textareas and add event listeners for enter and escape
    useEffect(() => {
        const textareas = document.getElementsByTagName("textarea");
        autosize(textareas);

        window.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                if (editTitle) {
                    (event.target as HTMLElement).blur();
                }
            }
            if (event.key === 'Escape') {
                //TODO revert to previous state
                (event.target as HTMLElement).blur();
            }
        });
    });

    // Set title and description when course is loaded
    useEffect(() => {
        setTitle(course?.title);
        setDescription(course?.description);
        setLanguage(course?.language);
    }, [course, courseIsSuccess]);

    const handleUpdate = async () => {
        try {
            updateCourse({
                id: course?.id,
                title,
                description
            });
            dispatch(pushNotification({
                message: "The course has been updated",
                type: "light"
            }));

        } catch (e) {
            dispatch(pushNotification({
                message: "Something went wrong. The course could not be updated",
                type: "danger"
            }));
        }
    }

    const handleDelete = (e: any) => {
        e.preventDefault();
        try {
            deleteCourse(id);
            navigate("/course")
        } catch (e) {
            console.log(e);
        }
    }

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang);
        updateLanguage({
            course_id: course?.id,
            language: lang
        });
        dispatch(pushNotification({
            message: `The course language has been updated to ${lang}`,
            type: "light"
        }));
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
        if (!isOwner || !editTitle) {
            return (
                <h1
                    className={"h2 fw-bold p-2" + (isOwner ? " teacher editable-title" : "")}
                    id="title-editable"
                    onFocus={() => isOwner ? setEditTitle(true) : null}
                    tabIndex={0} //allows focus
                >
                    {title}
                </h1>
            );
        } else if (isOwner && editTitle) {
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
                    onChange={(e: any) => setTitle(e.target.value)}
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
        if (!isOwner || !editDescription) {
            return (
                <blockquote
                    className={"p-3 pb-1 bg-light border rounded description" + (isOwner ? " teacher editable-description" : "")}
                    onFocus={() => setEditDescription(true)}
                    tabIndex={0} //allows focus
                >
                    <Markdown
                        children={description}
                    />
                </blockquote>
            )
        } else if (isOwner && editDescription) {
            return (
                <Form>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Control
                            as="textarea"
                            autoFocus
                            className="teacher description-input"
                            onBlur={() => {
                                if (description === "") {
                                    setDescription("No description");
                                }
                                setEditDescription(false);
                                handleUpdate();
                            }}
                            onChange={(e: any) => setDescription(e.target.value)}
                            placeholder="Enter course description. Markdown is supported."
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
    const ownerActionsContent = () => {
        return isOwner ? (
            <div className="d-flex justify-content-end">
                <Dropdown align="end">
                    <Dropdown.Toggle id="language-dropdown" className="text-capitalize" variant="outline-dark">
                        {language}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="gap-1 p-2 rounded-3 mx-0">
                        {languageChoices.map((choice: any) => (
                            <Dropdown.Item
                                className="rounded-2"
                                key={choice[0]}
                                eventKey={choice[0]}
                                onClick={() => handleLanguageChange(choice[0])}
                                active={choice[0] === language}
                            >
                                {choice[1]}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                &nbsp;

                <OverlayTrigger trigger="click" rootClose={true} placement="auto" overlay={deletePopover}>
                    <Button variant="light border border-danger text-danger" id="delete-button">Delete</Button>
                </OverlayTrigger>
            </div>
        ) : <></>
    }

    //Create session button (teacher only)
    const sessionListOwnerContent = () => {
        return isOwner ? (
            <ListGroup.Item id="create-session" action href={"/session/create?course_id=" + id}>
                + Create Session
            </ListGroup.Item>
        ) : (<></>)
    }

    //Create session button, on "no sessions" block (teacher only)
    const sessionListOwnerContentNoSessions = () => {
        return isOwner ? (
            <Button id="create-session-no-sessions" variant="light mb-3 border" href={"/session/create?course_id=" + id}>
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
                        {sessionListOwnerContentNoSessions()}
                    </ListGroup.Item>
                </ListGroup>
            )
        }
        else if (sessionsIsSuccess) {
            return (
                <ListGroup>
                    {sessions.map((session: any, i: number) => {
                        return <ListGroup.Item
                            action
                            variant="light"
                            href={"/session/" + session.id}
                            key={i}
                        >
                            {session.title}
                        </ListGroup.Item>
                    })}
                    {sessionListOwnerContent()}
                </ListGroup>
            )
        }
    }

    //Session not found or not authorized
    if (courseIsError || sessionsIsError) {
        return isTeacher ? (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The course you are looking for doesn't exist, <br />or you aren't allowed to access it.<br /><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
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
                        {ownerActionsContent()}
                    </div>
                </div>

                {isOwner || isTutor ? (<>
                    <Tabs className="mb-3" variant="pills">

                        <Tab eventKey="default" title="Description">
                            {descriptionContent()}
                        </Tab>

                        <Tab eventKey="sessions" title="Sessions">
                            {sessionContent()}
                        </Tab>

                        <Tab eventKey="students" title="Students">
                            <Students course={course} />
                        </Tab>

                        <Tab eventKey="teachers" title="Teachers">
                            <TeacherList courseId={id} isOwner={isOwner} />
                        </Tab>

                    </Tabs>
                </>) : (<>
                    {descriptionContent()}

                    <h2>Sessions</h2>
                    {sessionContent()}
                </>)}

            </Container>
        </>
    )
}

export default Course