import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useCreateTestMutation, useDeleteTestMutation, useUpdateTestMutation } from '../features/courses/testApiSlice';
import { useEffect, useState } from 'react';

import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetTestsOfExerciseQuery } from '../features/courses/testApiSlice';
import { useSelector } from 'react-redux';

const TestsEditor = (props:any) => {

    const [createTest] = useCreateTestMutation();
    const [deleteTest] = useDeleteTestMutation();
    const [editTest, setEditTest] = useState(false);
    const [editTestId, setEditTestId] = useState(null);
    const [hoveredTestId, setHoveredTestId] = useState(-1);
    const [tests, setTests] = useState([] as any[]);
    const [updateTest] = useUpdateTestMutation();
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //used to generate unique ids for tests
    const exercise = props.exercise;
    const username = useSelector(selectCurrentUser);

    const ownersUsernames = exercise?.session.course.owners.map((owner:any) => owner.username);
    const isOwner = ownersUsernames?.includes(username);

    const {
        data: testsResponse,
    } = useGetTestsOfExerciseQuery({'exercise_id':exercise.id});

    useEffect(() => {
        setTests(testsResponse);
    }, [testsResponse]);

    const handleCreateOrUpdateTest = async (testId: any) => {
        const test = tests.filter((t:any) => t.id===testId)[0]
        const newTest:boolean = test?.new;
        if (newTest) {
            await createTest({
                exercise: exercise.id,
                name: test.name,
                stdin: test.stdin,
                stdout: test.stdout,
            })

        } else {
            await updateTest({
                id: test.id,
                exercise: exercise.id,
                name: test.name,
                stdin: test.stdin,
                stdout: test.stdout
            })
        }
    }

    //Prevent blurring test div when focusing one of its inputs
    const handleTestBlur = (e : any) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setEditTest(false);
            handleCreateOrUpdateTest(editTestId);
        }
    }

    const handeDeleteTest = async (testId:any) => {
        try {
            await deleteTest({id:testId});
            //remove test from tests state
            setTests(tests.filter((t:any) => t.id!==testId));
        } catch (error) {
            console.log(error);
        }
    }

    return (exercise && tests) ? (
            <>

            <h6 className="text-muted fw-light">
                {isOwner ? "Click test to edit" : "Tests can be edited by owners"}
            </h6>

            {tests.map((test:any) => (

                <div className={"p-1 mb-1" + (isOwner ? " editable-test" : "") + (editTest && editTestId === test?.id ? " editable-test-focused" : "")} key={test?.id} tabIndex={0}
                    onFocus={() => {isOwner && setEditTestId(test?.id); setEditTest(true)}}
                    onBlur={(e) => {isOwner && handleTestBlur(e)}}
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
                                onChange={(e) => {isOwner && setTests(tests.map((t:any) => t.id === test?.id ? {...t, name: e.target.value} : t))}}
                                {...(editTest && editTestId === test?.id ? {} : {disabled: true, readOnly: true})}
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
                                onChange={(e) => {isOwner && setTests(tests.map((t:any) => t.id === test?.id ? {...t, stdin: e.target.value} : t))}}
                                {...(editTest && editTestId === test?.id ? {} : {disabled: true, readOnly: true})}
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
                                onChange={(e) => {setTests(tests.map((t:any) => t.id === test?.id ? {...t, stdout: e.target.value} : t))}}
                                {...(editTest && editTestId === test?.id ? {} : {disabled: true, readOnly: true})}
                            />

                        </InputGroup>
                        </Col>
                        <Col>
                        {(editTest && editTestId === test?.id) || hoveredTestId === test?.id ? (
                            <Button
                                className="btn-link delete-button btn-light text-danger text-decoration-none float-end"
                                onClick={(e) => {isOwner && handeDeleteTest(editTestId)}}
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
                        //generates a random id to differentiate between new tests. On creating the test, this id will be ignored by the API.
                        const randomId = Array(16).join().split(',').map(function() { return alphabet.charAt(Math.floor(Math.random() * alphabet.length)); }).join('');
                        setTests([...tests, {id: randomId, name: "New Test", stdin: "", stdout: "", new:true}])
                    }}
                >
                    + ADD TEST
                </Button>
            ) : (<></>)}

        </>
    ) : (<></>)
}

export default TestsEditor