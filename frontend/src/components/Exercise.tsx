import { Breadcrumb, Button, Col, Container, Form, InputGroup, Row, Tab, Tabs } from "react-bootstrap";
import { selectCurrentUser, selectIsTeacher } from "../features/auth/authSlice";
import { useCreateExerciseMutation, useDeleteExerciseMutation, useGetExerciseQuery, useUpdateExerciseMutation } from "../features/courses/exerciseApiSlice";
import { useCreateTestMutation, useDeleteTestMutation, useGetTestsOfExerciseQuery, useUpdateTestMutation } from "../features/courses/testApiSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "./Header";
import ReactMarkdown from "react-markdown";
import TestResult from "./TestResult";
import { useCreateSubmissionMutation } from "../features/submission/submissionApiSlice";
import { useSelector } from "react-redux";

const Exercise = () => {

    const [createExercise] = useCreateExerciseMutation();
    const [createSubmission] = useCreateSubmissionMutation();
    const [createTest] = useCreateTestMutation();
    const [deleteTest] = useDeleteTestMutation();
    const [description, setDescription] = useState("");
    const [editDescription, setEditDescription] = useState(false);
    const [editTest, setEditTest] = useState(false);
    const [editTestId, setEditTestId] = useState(null);
    const [editTitle, setEditTitle] = useState(false);
    const [tests, setTests] = useState([] as any[]);
    const [title, setTitle] = useState("");
    const [updateExercise] = useUpdateExerciseMutation();
    const [updateTest] = useUpdateTestMutation();
    const { exercise_id } : any = useParams();
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //used to generate unique ids for tests
    const navigate = useNavigate();

    const {
        data: exercise,
        isLoading: exerciseIsLoading,
        isSuccess: exerciseIsSuccess,
        isError: exerciseIsError,
        error: exerciseError,
    } = useGetExerciseQuery({id:exercise_id});

    const {
        data: testsResponse,
        isLoading: testsIsLoading,
        isSuccess: testsIsSuccess,
        isError: testsIsError,
        error: testsError,
    } = useGetTestsOfExerciseQuery({exercise_id});

    const session = exercise?.session
    const course = session?.course
    const user = useSelector(selectCurrentUser);
    const isTeacher = useSelector(selectIsTeacher);

    useEffect(() => {
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

    const handleCreateOrUpdateTest = async (testId: any) => {
        const test = tests.filter((t:any) => t.id===testId)[0]
        const newTest:boolean = test?.new;
        if (newTest) {
            await createTest({
                exercise: exercise_id,
                name: test.name,
                stdin: test.stdin,
                stdout: test.stdout,
            })
            //reload page
            window.location.reload();

        } else {
            await updateTest({
                id: test.id,
                exercise: exercise_id,
                name: test.name,
                stdin: test.stdin,
                stdout: test.stdout,
            })
        }
    }

    const handeDeleteTest = async (testId:any) => {
        const test = tests.filter((t:any) => t.id===testId)[0]
        try {
            await deleteTest({id:testId});
            //remove test from tests state
            setTests(tests.filter((t:any) => t.id!==testId));
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e : any) => {
        e.preventDefault();

        const form=e.target[0];
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        
        var formData = new FormData();
        formData.append("exercise", exercise.id)
        formData.append("file", form.files[0])

        await createSubmission(formData).unwrap()

    }

    //Prevent blurring test div when focusing one of its inputs
    const handleTestBlur = (e : any) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setEditTest(false);
            handleCreateOrUpdateTest(editTestId);
        }
    }

    const testsContent = () => {
        if (!isTeacher) {
            return <></>
        }
        return (exerciseIsSuccess && tests) ? (
            <>
                        
            <h3>Tests</h3>

            <h6 className="text-muted fw-light">Click to edit</h6>

            {tests.map((test:any) => (

                <div className={"mb-3 p-3 border rounded " + (editTest && editTestId === test?.id ? "border-primary" : "")} key={test?.id} tabIndex={0}
                    onFocus={() => {setEditTestId(test?.id); setEditTest(true)}}
                    onBlur={(e) => {handleTestBlur(e)}}
                >
                    <Row className="">
                        <Col>
                            
                            <Form.Control
                                className="bg-white border-0 fw-bold p-0"
                                placeholder="Test name"
                                aria-label="Test name"
                                value={test?.name}
                                autoComplete="off"
                                onChange={(e) => {setTests(tests.map((t:any) => t.id === test?.id ? {...t, name: e.target.value} : t))}}
                                {...(editTest && editTestId === test?.id ? {} : {disabled: true, readOnly: true})}
                            />

                        </Col>

                        <Col className="fw-bold">
                            {editTest && editTestId === test?.id ? (
                                <Button className="btn-link btn-light text-danger text-decoration-none p-0 float-end"
                                    onClick={(e) => {handeDeleteTest(editTestId)}}
                                >
                                    Delete
                                </Button>
                            ) : (<></>)}
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col>
                            <InputGroup className="">

                                <InputGroup.Text>Input</InputGroup.Text>

                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder="Input"
                                    aria-label="Input"
                                    value={test?.stdin}
                                    autoComplete="off"
                                    onChange={(e) => {setTests(tests.map((t:any) => t.id === test?.id ? {...t, stdin: e.target.value} : t))}}
                                    {...(editTest && editTestId === test?.id ? {} : {disabled: true, readOnly: true})}
                                />

                                <InputGroup.Text>
                                    🡒 {/* Long arrow unicode Caution:works with Inter only */}
                                </InputGroup.Text>

                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder="Output"
                                    aria-label="Ouput"
                                    value={test?.stdout}
                                    autoComplete="off"
                                    onChange={(e) => {setTests(tests.map((t:any) => t.id === test?.id ? {...t, stdout: e.target.value} : t))}}
                                    {...(editTest && editTestId === test?.id ? {} : {disabled: true, readOnly: true})}
                                />

                                <InputGroup.Text>Ouput</InputGroup.Text>

                            </InputGroup>
                        </Col>
                    </Row>
                </div>
            ))}

            <Button
                className="btn-link btn-light"
                onClick={(e) => {
                    //generates a random id to differentiate between new tests. On creating the test, this id will be ignored by the API.
                    const randomId = Array(16).join().split(',').map(function() { return alphabet.charAt(Math.floor(Math.random() * alphabet.length)); }).join('');
                    setTests([...tests, {id: randomId, name: "New Test", stdin: "", stdout: "", new:true}])
                }}
            >
                + ADD TEST
            </Button>

        </>
        ) : (<></>)

    }

    const submissionContent = () => {
        return (<>
            <h2 className="h4">
                Submit your work
            </h2>
            <Form className="submission p-4 border rounded bg-light" onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Submission file</Form.Label>
                    <Form.Control required type="file" name="file"/>
                    <Form.Text className="text-muted">You are logged in as <u>{user}</u></Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>

            <br />
            
            <TestResult />
        </>)
    }

    if(exerciseIsError) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The exercise you are looking for doesn't exist, <br />or you aren't allowed to access it.<br/><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        )
    }

    return exerciseIsLoading ? (
        <></>
    ):(<>

    <Header />

    <Container className="mb-3">

        <Breadcrumb>
            <Breadcrumb.Item href="/course">
                Courses
            </Breadcrumb.Item>
            <Breadcrumb.Item href={"/course/"+course.id}>
                {course.title}
            </Breadcrumb.Item>
            <Breadcrumb.Item href={"/session/"+session.id}>
                {session.title}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
                {exercise.title}
            </Breadcrumb.Item>
        </Breadcrumb>

        <br />

        <h1>{title}</h1>

        <Tabs
            defaultActiveKey="exercise"
            id="exercise-tabs"
            className="mb-3"
        >
            <Tab eventKey="exercise" title="Exercise">
                <blockquote>
                    {description}
                </blockquote>
            </Tab>

            {isTeacher ? (
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