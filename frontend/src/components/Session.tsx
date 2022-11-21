import { Breadcrumb, Button, Container, Form, ListGroup, OverlayTrigger, Popover } from "react-bootstrap";
import { useDeleteSessionMutation, useGetSessionQuery, useUpdateSessionMutation } from "../features/courses/sessionApiSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "./Header";
import Markdown from "./Markdown";
import autosize from "autosize";
import { selectIsTeacher } from "../features/auth/authSlice";
import { useGetExercisesOfSessionQuery } from "../features/courses/exerciseApiSlice";
import { useSelector } from "react-redux";

const Session = () => {

    const { id }:any = useParams();
    const isTeacher = useSelector(selectIsTeacher);
    const [updateSession] = useUpdateSessionMutation();
    const [deleteSession] = useDeleteSessionMutation();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editTitle, setEditTitle] = useState(false);
    const [editDescription, setEditDescription] = useState(false);

    useEffect(() => {

        //autosize textareas
        const textareas = document.getElementsByTagName("textarea");
        autosize(textareas);
        
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
        data: session,
        isLoading: sessionIsLoading,
        isSuccess: sessionIsSuccess,
        isError: sessionIsError,
        error: sessionError
    } = useGetSessionQuery({id});

    useEffect(() => {
        setTitle(session?.title);
        setDescription(session?.description);
    }, [session, sessionIsSuccess]);

    const {
        data: exercises,
        isLoading: exercisesIsLoading,
        isSuccess: exercisesIsSuccess,
        isError: exercisesIsError,
        error: exercisesError
    } = useGetExercisesOfSessionQuery({session_id:id});

    const course = session?.course

    const handleUpdate = () => {
        try {
            updateSession({
                course_id: course?.id,
                id: session?.id,
                title,
                description,
            });
        } catch (e) {
            console.log(e);
        }
    }

    const handleDelete = (e:any) => {
        e.preventDefault();
        try {
            deleteSession({id});
        } catch (e) {
            console.log(e);
        } finally {
            navigate(`/course/${course?.id}`);
        }
    }

    const deletePopover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Are you sure?</Popover.Header>
            <Popover.Body>
            This will <strong>remove permanently</strong> this session and all its exercises. <br /><br />
            <Button onClick={handleDelete} type="submit" size="sm" variant="danger">Delete session</Button>
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
                    tabIndex={0} //allows focus
                    onFocus={() => isTeacher ? setEditTitle(true) : null}
                >
                    {title}
                </h1>
            );
        } else if (isTeacher && editTitle) {
            return (
                <input
                    autoFocus
                    id="title-input"
                    type="text"
                    className="teacher title-input h2 fw-bold p-2"
                    value={title} 
                    onChange={(e:any) => setTitle(e.target.value)}
                    onBlur={() => {
                        if (title === "") {
                            setTitle("Untitled session");
                        }
                        setEditTitle(false)
                        handleUpdate();
                    }}
                    placeholder="Enter session title"
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
                    tabIndex={0} //allows focus
                    className={"p-3 pb-1 bg-light rounded description" + (isTeacher ? " teacher editable-description" : "")}
                    onFocus={() => setEditDescription(true)}>
                    <Markdown children={description} />
                </blockquote>
            )
        } else if (isTeacher && editDescription) {
            return (
                <Form>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Control
                            autoFocus
                            as="textarea"
                            className="teacher description-input"
                            value={description}
                            onChange={(e:any) => setDescription(e.target.value)}
                            onBlur={() => {
                                if(description === "") {
                                    setDescription("No description");
                                }
                                setEditDescription(false);
                                handleUpdate();
                            }}
                            placeholder="Enter course description. Markdown is supported."
                        />
                        <Form.Text className="text-muted">
                            You are editing the description - Markdown supported !
                        </Form.Text>
                    </Form.Group>
                </Form>
            )
        }
    }

    const teacherActionsContent = () => {
        return isTeacher ? (
            <div className="d-flex justify-content-end">
                <OverlayTrigger trigger="click" rootClose={true} placement="auto" overlay={deletePopover}>
                    <Button variant="light border border-danger text-danger">Delete</Button>
                </OverlayTrigger>
            </div>
        ) : <></>
    }

    const exerciseListTeacherContent = () => {
        return isTeacher ? (
            <ListGroup.Item action href={"/exercise/create?session_id="+id}>
                        + Create Exercise
            </ListGroup.Item>
        ) : (<></>)
    }

    const exerciseListTeacherContentNoExercises = () => {
        return isTeacher ? (
            <Button variant="light mb-3 border" href={"/exercise/create?session_id="+id}>
                + Create exercise
            </Button>
        ) : (<></>)
    }

    //Exercises list, or 'no exercises' block if no exercises
    const exercisesContent = () => {
        if (exercisesIsLoading) {
            return (
                <p>Loading sessions...</p>
            )
        }
        else if (exercisesIsSuccess && exercises.length === 0) {
            return (
                <ListGroup>
                    <ListGroup.Item className="text-muted text-center dashed-border">
                        <br />
                        <p>This session doesn't have any exercises.</p>
                        {exerciseListTeacherContentNoExercises()}
                    </ListGroup.Item>
                </ListGroup>
            )
        }
        else if (exercisesIsSuccess) {
            return (
                <ListGroup>
                {exercises.map((exercise:any, i:number) => {
                    return <ListGroup.Item
                        action
                        variant="light"
                        href={"/exercise/"+exercise.id}
                        key={i}
                    >
                        {exercise.title}
                    </ListGroup.Item>
                })}
                {exerciseListTeacherContent()}
                </ListGroup>
            )
        }
    }

    if(exercisesIsError || sessionIsError) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The session you are looking for doesn't exist, <br />or you aren't allowed to access it.<br/><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        )
    }

    return sessionIsLoading  ? (
        <></>
    ) : (
        <>
            <Header />
                
            <Container>
                <Breadcrumb>
                    <Breadcrumb.Item href="/course">
                        Courses
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href={"/course/"+course.id}>
                        {course.title}
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

                <h2>Exercises</h2>
                {exercisesContent()}

            </Container>
        </>
    )
}

export default Session