import { CheckIcon, ExclamationTriangleIcon, PlusIcon, TrashIcon } from '@heroicons/react/16/solid'
import { useCreateTestMutation, useDeleteTestMutation, useGetTestsOfExerciseQuery, useUpdateTestMutation } from "../../features/courses/testApiSlice";
import { useEffect, useState } from 'react'

import { Modal } from "../Common";
import autosize from 'autosize';
import { pushNotification } from '../../features/notification/notificationSlice';
import { useDispatch } from 'react-redux';

interface Test {
    id: number;
    exercise: number;
    name: string;
    stdin: string;
    stdout: string;
    coefficient: number;
    new: boolean;
}

const ExerciseTestsTab = (props: any) => {

    const NEW_TEST_NAME = "New Test";

    const { exerciseIsSuccess, isOwner, exercise_id } = props

    const [createTest] = useCreateTestMutation();
    const [deleteTest] = useDeleteTestMutation();
    const [showModal, setShowModal] = useState(false);
    const [tests, setTests] = useState([] as Test[]);
    const [updateTest] = useUpdateTestMutation();
    const dispatch = useDispatch();

    const {
        data: testsResponse,
    } = useGetTestsOfExerciseQuery({ exercise_id });


    useEffect(() => {
        setTests(testsResponse);
    }, [testsResponse]);

    useEffect(() => {
        // autosize(document.querySelectorAll('textarea'));
        const duplicateNames: boolean = tests?.some((t1: Test) => tests.filter((t2: Test) => t1.name === t2.name).length > 1);

        if (duplicateNames) {
            dispatch(pushNotification({
                message: "Test names must be unique",
                type: "warning",
            }));
        }

    }, [tests]);

    const randomTestId = (): number => {
        return Math.floor(Math.random() * 10000) + 1000;
    }

    const handleSaveAllTests = async () => {
        tests.forEach(test => {
            handleCreateOrUpdateTest(test.id)
        });
    }

    const handleCreateOrUpdateTest = async (testId: number) => {
        const test: Test = tests.find((t: Test) => t.id === testId)!;
        const newTest: boolean = test?.new || false;
        if (newTest) {
            await createTest({
                exercise: exercise_id,
                name: test.name,
                stdin: test.stdin,
                stdout: test.stdout,
            })
                .unwrap()
                .then((response: Test) => {
                    // set test as not new, with new id
                    const newTestId = response.id
                    setTests(tests.map((t: Test) => t.id === testId ? { ...t, new: false, id: newTestId } : t))
                    dispatch(pushNotification({
                        message: "Test created successfully",
                        type: "success",
                    }));
                })
                .catch((error) => {
                    dispatch(pushNotification({
                        message: "There was an error creating the test.",
                        type: "error",
                    }));
                });
        } else {
            await updateTest({
                id: test.id,
                exercise: exercise_id,
                name: test.name,
                stdin: test.stdin,
                stdout: test.stdout
            })
                .unwrap()
                .catch((error) => {
                    dispatch(pushNotification({
                        message: "There was an error updating the test.",
                        type: "error",
                    }));
                });
        }
    }

    const handleDeleteConfirmation = async (test_id: number) => {
        const test = tests.find((t: Test) => t.id === test_id);
        if (!test?.new) {
            await deleteTest({ id: test_id })
                .unwrap()
                .then(() => {
                    dispatch(pushNotification({
                        message: "Test deleted successfully",
                        type: "success",
                    }));
                })
                .catch((error) => {
                    dispatch(pushNotification({
                        message: "There was an error deleting the test",
                        type: "error",
                    }));
                });
        }
        setShowModal(false);
        setTests(tests.filter((t: Test) => t.id !== test_id));
    }

    return (
        <div className='pb-3'>
            {exerciseIsSuccess && tests && (
                <>
                    {tests.length > 0 ? (
                        <h6 className="text-sm px-1 mb-1 text-gray-500">
                            {isOwner ? "" : "Tests can only be edited by owners"}
                        </h6>
                    ) : (
                        <div className="flex flex-col py-4 rounded-lg">
                            <h6 className="text-gray-600 text-sm mb-4">This exercise doesn't have any tests.</h6>
                            {isOwner && (
                                <button
                                    className="flex items-center w-fit text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 font-bold py-1 px-2 rounded-lg focus:outline-none focus:shadow-outline"
                                    onClick={(e) => {
                                        const randomId = randomTestId();
                                        const newTest: Test = { id: randomId, name: NEW_TEST_NAME, stdin: "", stdout: "", new: true, exercise: exercise_id, coefficient: 1 };
                                        setTests([...tests, newTest]);
                                    }}
                                >
                                    <PlusIcon className="mr-2 size-4" />
                                    Create test
                                </button>
                            )}
                        </div>

                    )}

                    {tests.map((test) => (
                        <div
                            key={test?.id}
                            className={`relative group w-full grid grid-cols-[20%_80%] md:grid-cols-[10%_90%] grid-rows-3 text-sm *:border-gray-200 mb-2`}
                            tabIndex={0}
                        >
                            <span className='border-l border-t rounded-tl-lg p-2'>Title</span>
                            <input
                                type="text"
                                placeholder="Test name"
                                aria-label="Test name"
                                value={test?.name}
                                autoComplete="off"
                                className={`p-2 w-full bg-gray-50 border border-b-0 rounded-tr-lg text-gray-700 focus:outline-none focus:border-blue-500`}
                                onChange={(e) => {
                                    isOwner && setTests(
                                        tests.map((t) =>
                                            t.id === test?.id ? { ...t, name: e.target.value } : t
                                        ));
                                }}
                            />

                            <span className="border-l border-t p-2">Input</span>
                            <textarea
                                className="p-2 w-full border border-b-0 bg-gray-50 text-gray-700 focus:outline-none focus:border-blue-500 font-mono"
                                placeholder="Input to test for"
                                rows={1}
                                aria-label="Input"
                                value={test?.stdin}
                                autoComplete="off"
                                onChange={(e) => {
                                    isOwner &&
                                        setTests(
                                            tests.map((t) =>
                                                t.id === test?.id ? { ...t, stdin: e.target.value } : t
                                            )
                                        );
                                }}
                            />

                            <span className="border-l border-t border-b rounded-bl-lg p-2">Output</span>
                            <textarea
                                className="p-2 w-full border rounded-br-lg bg-gray-50 text-gray-700 focus:outline-none focus:border-blue-500 font-mono"
                                placeholder="Expected output"
                                rows={1}
                                aria-label="Output"
                                value={test?.stdout}
                                autoComplete="off"
                                onChange={(e) => {
                                    setTests(
                                        tests.map((t) =>
                                            t.id === test?.id ? { ...t, stdout: e.target.value } : t
                                        )
                                    );
                                }}
                            />
                            <button
                                className="hidden group-hover:flex items-center absolute end-2 top-2 focus:outline-none text-gray-400 border border-gray-300 hover:bg-red-50 hover:border-red-500 hover:text-red-500 rounded-lg px-2 w-fit transition-all"
                                onClick={() => test?.name !== NEW_TEST_NAME || test?.stdin || test?.stdout ? setShowModal(true) : handleDeleteConfirmation(test.id)}
                            >
                                <TrashIcon className="size-3" />
                                <span className='ms-1.5'>Delete</span>
                            </button>

                            <>
                                {showModal && (
                                    <Modal
                                        title={<h2 className="text-xl font-semibold">Confirmation</h2>}
                                        icon={<ExclamationTriangleIcon className="text-yellow-500 w-12 h-12 mb-2" />}
                                        decription={<p className="mb-4">Are you sure you want to delete this test?</p>}
                                        handleCloseModal={() => setShowModal(false)}
                                        delete={() => handleDeleteConfirmation(test.id)}
                                    />

                                )}
                            </>
                        </div>
                    ))}
                    {isOwner && tests.length > 0 && (
                        <div className="mt-2 flex gap-2">
                            <button
                                className="flex items-center gap-2 text-primary text-sm bg-white hover:bg-gray-50 border border-gray-200 font-semibold py-2 px-4 rounded-lg"
                                onClick={(e) => {
                                    const randomId = randomTestId();
                                    const newTest: Test = { id: randomId, name: NEW_TEST_NAME, stdin: "", stdout: "", new: true, exercise: exercise_id, coefficient: 1 };
                                    setTests([...tests, newTest]);
                                }}
                            >
                                <PlusIcon className="w-4 h-4" />
                                Add test
                            </button>
                            <button
                                className="flex items-center gap-2 text-primary text-sm bg-blue-50 hover:bg-blue-100 text-blue-500 border border-blue-200 font-semibold py-2 px-4 rounded-lg"
                                onClick={handleSaveAllTests}
                            >
                                <CheckIcon className='w-4 h-4' />
                                Save tests
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );

}

export default ExerciseTestsTab