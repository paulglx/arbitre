import { Breadcrumb, Button, Col, Container, Form, InputGroup, OverlayTrigger, Popover, Row, Tab, Tabs } from "react-bootstrap";
import { selectCurrentUser, selectIsTeacher } from "../features/auth/authSlice";
import { useCreateTestMutation, useDeleteTestMutation, useGetTestsOfExerciseQuery, useUpdateTestMutation } from "../features/courses/testApiSlice";
import { useDeleteExerciseMutation, useGetExerciseQuery, useUpdateExerciseMutation } from "../features/courses/exerciseApiSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "./Header";
import Markdown from "./Markdown";
import TestResult from "./TestResult";
import autosize from "autosize";
import { useCreateSubmissionMutation } from "../features/submission/submissionApiSlice";
import { useSelector } from "react-redux";

const Exercise = () => {

    const [activeTab, setActiveTab] = useState("description");
    const [createSubmission] = useCreateSubmissionMutation();
    const [createTest] = useCreateTestMutation();
    const [deleteExercise] = useDeleteExerciseMutation();
    const [deleteTest] = useDeleteTestMutation();
    const [description, setDescription] = useState("");
    const [editDescription, setEditDescription] = useState(false);
    const [editTest, setEditTest] = useState(false);
    const [editTestId, setEditTestId] = useState(null);
    const [editTitle, setEditTitle] = useState(false);
    const [hoveredTestId, setHoveredTestId] = useState(-1);
    const [tests, setTests] = useState([] as any[]);
    const [title, setTitle] = useState("");
    const [updateExercise] = useUpdateExerciseMutation();
    const [updateTest] = useUpdateTestMutation();
    const { exercise_id }: any = useParams();
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //used to generate unique ids for tests
    const isTeacher = useSelector(selectIsTeacher);
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

    const {
        data: testsResponse,
    } = useGetTestsOfExerciseQuery({ exercise_id });

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
    }, [exercise]);

    useEffect(() => {
        setTests(testsResponse);
    }, [testsResponse]);

    const handleUpdateExercise = async () => {
        try {
            await updateExercise({ id: exercise_id, title, description, session_id: session.id });
        } catch (error) {
            console.log(error);
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

    const handleCreateOrUpdateTest = async (testId: any) => {
        const test = tests.filter((t: any) => t.id === testId)[0]
        const newTest: boolean = test?.new;
        if (newTest) {
            await createTest({
                exercise: exercise_id,
                name: test.name,
                stdin: test.stdin,
                stdout: test.stdout,
            })
        } else {
            await updateTest({
                id: test.id,
                exercise: exercise_id,
                name: test.name,
                stdin: test.stdin,
                stdout: test.stdout
            })
        }
    }

    const handeDeleteTest = async (testId: any) => {
        try {
            await deleteTest({ id: testId });
            //remove test from tests state
            setTests(tests.filter((t: any) => t.id !== testId));
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const form = e.target[0];
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        const formData = new FormData();
        formData.append("exercise", exercise.id)
        formData.append("file", form.files[0])

        await createSubmission(formData).unwrap()

        // refresh page
        window.location.reload(); //TODO update state instead
    }

    //Prevent blurring test div when focusing one of its inputs
    const handleTestBlur = (e: any) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setEditTest(false);
            handleCreateOrUpdateTest(editTestId);
        }
    }

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

    const testsContent = () => {
        return (exerciseIsSuccess && tests) ? (
            <>

                {tests.length > 0 ?
                    <h6 className="text-muted">
                        {isOwner ? "Click test to edit" : "Tests can be edited by owners"}
                    </h6>
                    :
                    <h6 className="text-muted">
                        No tests yet
                    </h6>
                }

                {tests.map((test: any) => (

                    <div className={"p-1 mb-1" + (isOwner ? " editable-test" : "") + (editTest && editTestId === test?.id ? " editable-test-focused" : "")} key={test?.id} tabIndex={0}
                        onFocus={() => { isOwner && setEditTestId(test?.id); setEditTest(true) }}
                        onBlur={(e) => { isOwner && handleTestBlur(e) }}
                        onMouseEnter={() => isOwner && setHoveredTestId(test?.id)}
                        onMouseLeave={() => isOwner && setHoveredTestId(-1)}
                    >

                        <Row className="g-2">
                            <Col md={3}>
                                <Form.Control
                                    className={"bg-white fw-bold" + (editTest && editTestId === test?.id ? " " : " border")}
                                    placeholder="Test name"
                                    aria-label="Test name"
                                    value={test?.name}
                                    autoComplete="off"
                                    onChange={(e) => { isOwner && setTests(tests.map((t: any) => t.id === test?.id ? { ...t, name: e.target.value } : t)) }}
                                    {...(editTest && editTestId === test?.id ? {} : { disabled: true, readOnly: true })}
                                />
                            </Col>

                            <Col md={4}>
                                <InputGroup>
                                    <InputGroup.Text>Input</InputGroup.Text>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Input to test for"
                                        rows={1}
                                        aria-label="Input"
                                        value={test?.stdin}
                                        autoComplete="off"
                                        onChange={(e) => { isOwner && setTests(tests.map((t: any) => t.id === test?.id ? { ...t, stdin: e.target.value } : t)) }}
                                        {...(editTest && editTestId === test?.id ? {} : { disabled: true, readOnly: true })}
                                    />
                                </InputGroup>
                            </Col>

                            <Col md={4}>
                                <InputGroup>
                                    <InputGroup.Text>Output</InputGroup.Text>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Expected output"
                                        rows={1}
                                        aria-label="Ouput"
                                        value={test?.stdout}
                                        autoComplete="off"
                                        onChange={(e) => { setTests(tests.map((t: any) => t.id === test?.id ? { ...t, stdout: e.target.value } : t)) }}
                                        {...(editTest && editTestId === test?.id ? {} : { disabled: true, readOnly: true })}
                                    />
                                </InputGroup>
                            </Col>
                            <Col>
                                {(editTest && editTestId === test?.id) || hoveredTestId === test?.id ? (
                                    <Button
                                        className="btn-link delete-button btn-light text-danger text-decoration-none float-end"
                                        onClick={(e) => { isOwner && handeDeleteTest(editTestId) }}
                                    >
                                        Delete
                                    </Button>
                                ) : (<></>)}
                            </Col>
                        </Row>
                    </div>
                ))}

                {isOwner ? (
                    <Button
                        className="btn-link btn-light"
                        onClick={(e) => {
                            //generates a random id to differentiate between new tests. Upon creating the test, this id will be ignored by the API.
                            const randomId = Array(16).join().split(',').map(function () { return alphabet.charAt(Math.floor(Math.random() * alphabet.length)); }).join('');
                            setTests([...tests, { id: randomId, name: "New Test", stdin: "", stdout: "", new: true }])
                        }}
                    >
                        + ADD TEST
                    </Button>
                ) : (<></>)}

            </>
        ) : (<></>)

    }

    const submissionContent = () => {
        return (<>
            <Form className="submission p-4 border rounded bg-light" onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Submission file</Form.Label>
                    <Form.Control required type="file" name="file" />
                    <Form.Text className="text-muted">You are logged in as <u>{username}</u></Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <br />
            <TestResult exercise_id={exercise.id} />
        </>)
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
                        {testsContent()}
                    </Tab>
                ) : (<></>)}

                <Tab eventKey="submission" title="Submission">
                    {submissionContent()}
                </Tab>

            </Tabs>

        </Container>
    </>)
}

export default Exercise
