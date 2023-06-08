import { Breadcrumb, Button, Container, Form, OverlayTrigger, Popover, Tab, Tabs } from "react-bootstrap";
import { useDeleteExerciseMutation, useGetExerciseQuery, useUpdateExerciseMutation } from "../../features/courses/exerciseApiSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ExerciseRuntimeTab from "./ExerciseRuntimeTab";
import ExerciseSubmissionTab from "./ExerciseSubmissionTab";
import ExerciseTestsTab from "./ExerciseTestsTab";
import Header from "../Header/Header";
import Markdown from "../Util/Markdown";
import autosize from "autosize";
import { pushNotification } from "../../features/notification/notificationSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Exercise = () => {

    const [activeTab, setActiveTab] = useState("description");
    const [deleteExercise] = useDeleteExerciseMutation();
    const [description, setDescription] = useState("");
    const [editDescription, setEditDescription] = useState(false);
    const [editTitle, setEditTitle] = useState(false);
    const [prefix, setPrefix] = useState("");
    const [suffix, setSuffix] = useState("");
    const [title, setTitle] = useState("");
    const [updateExercise] = useUpdateExerciseMutation();
    const { exercise_id }: any = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const urlTab = useParams()?.tab;
    const username = useSelector(selectCurrentUser);

    const {
        data: exercise,
        isLoading: exerciseIsLoading,
        isSuccess: exerciseIsSuccess,
        isError: exerciseIsError,
    } = useGetExerciseQuery({ id: exercise_id });

    const session = exercise?.session
    const course = session?.course
    const isOwner = course?.owners?.map((o: any) => o.username).includes(username);
    const isTutor = course?.tutors?.map((t: any) => t.username).includes(username);

    const toggle = (tab: any) => {
        if (activeTab !== tab) navigate(`/exercise/${exercise_id}/${tab}`, { replace: true });
    }

    useEffect(() => {
        if (!urlTab) {
            navigate(`./description`, { replace: true });
        }
        setActiveTab(urlTab!);
    }, [urlTab, navigate]);

    //On load
    useEffect(() => {

        //autosize textareas
        // TODO fix jumping page
        const textareas = document.getElementsByTagName("textarea");
        autosize(textareas)

        window.addEventListener('keyup', (event) => {
            if (event.key === 'Escape') {
                //TODO revert to previous state
                (event.target as HTMLElement).blur();
            }
        });
    });

    useEffect(() => {
        setTitle(exercise?.title);
        setDescription(exercise?.description);
        setPrefix(exercise?.prefix);
        setSuffix(exercise?.suffix);
    }, [exercise]);

    const handleUpdateExercise = async () => {
        try {
            await updateExercise({ id: exercise_id, title, description, session_id: session.id, prefix, suffix });
            dispatch(pushNotification({
                message: "The exercise has been updated",
                type: "light"
            }));
        } catch (error) {
            dispatch(pushNotification({
                message: "There was an error updating the exercise.",
                type: "danger"
            }));
        }
    }

    const handleDeleteExercise = async () => {
        try {
            await deleteExercise({ id: exercise_id });
            navigate(`/session/${session.id}`)
        } catch (error) {
            console.log(error);
        }
    }

    const deletePopover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Are you sure?</Popover.Header>
            <Popover.Body>
                This will <strong>remove permanently</strong> this exercise, and all associated submissions.<br /><br />
                <Button id="confirm-delete" onClick={handleDeleteExercise} type="submit" size="sm" variant="danger">Delete exercise</Button>
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
                            setTitle("Untitled exercise");
                        }
                        setEditTitle(false)
                        handleUpdateExercise();
                    }}
                    onChange={(e: any) => setTitle(e.target.value)}
                    placeholder="Enter exercise title"
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
                    className={"p-3 pb-1 bg-light rounded border description" + (isOwner ? " teacher editable-description" : "")}
                    onFocus={() => setEditDescription(true)}
                    tabIndex={0} //allows focus
                >
                    <Markdown children={description} />
                </blockquote>
            )
        } else if (isOwner && editDescription) {
            return (
                <Form>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Control
                            as="textarea"
                            autoFocus
                            className="teacher description-input border"
                            onBlur={() => {
                                if (description === "") {
                                    setDescription("No description");
                                }
                                setEditDescription(false);
                                handleUpdateExercise();
                            }}
                            onChange={(e: any) => setDescription(e.target.value)}
                            placeholder="Enter exercise description. Markdown is supported."
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
        return isOwner ? (
            <div className="d-flex justify-content-end">
                <OverlayTrigger trigger="click" rootClose={true} placement="auto" overlay={deletePopover}>
                    <Button variant="light border border-danger text-danger" id="delete-button">Delete</Button>
                </OverlayTrigger>
            </div>
        ) : <></>
    }

    if (exerciseIsError) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The exercise you are looking for doesn't exist, <br />or you aren't allowed to access it.<br /><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        )
    }

    return exerciseIsLoading ? (
        <></>
    ) : (<>

        <Header />

        <Container className="mb-3">

            <Breadcrumb>
                <Breadcrumb.Item href="/course">
                    Courses
                </Breadcrumb.Item>
                <Breadcrumb.Item href={"/course/" + course.id}>
                    {course.title}
                </Breadcrumb.Item>
                <Breadcrumb.Item href={"/session/" + session.id}>
                    {session.title}
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    {exercise.title}
                </Breadcrumb.Item>
            </Breadcrumb>

            <br />

            <div className="d-flex align-items-center justify-content-between">
                {titleContent()}
                <div className="p-0 mb-2">
                    {teacherActionsContent()}
                </div>
            </div>

            <Tabs
                activeKey={activeTab}
                onSelect={(key: any) => { key && toggle(key) }}
                id="exercise-tabs"
                className="mb-3"
                variant="pills"
            >
                <Tab eventKey="description" title="Description">
                    {descriptionContent()}
                </Tab>

                {isOwner || isTutor ? (
                    <Tab eventKey="tests" title="Tests">
                        <ExerciseTestsTab exercise_id={exercise.id} isOwner={isOwner} exerciseIsSuccess={exerciseIsSuccess} />
                    </Tab>
                ) : (<></>)}

                {isOwner || isTutor ? (
                    <Tab eventKey="runtime" title="Runtime">
                        <ExerciseRuntimeTab course={course} session={session} exercise={exercise} isOwner={isOwner} />
                    </Tab>
                ) : (<></>)}

                <Tab eventKey="submission" title="Submission">
                    <ExerciseSubmissionTab exercise={exercise} username={username} />
                </Tab>

            </Tabs>

        </Container>
    </>)
}

export default Exercise
