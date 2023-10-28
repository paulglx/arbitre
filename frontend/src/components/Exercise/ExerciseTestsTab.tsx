import { ExclamationTriangleIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useCreateTestMutation, useDeleteTestMutation, useGetTestsOfExerciseQuery, useUpdateTestMutation } from "../../features/courses/testApiSlice";
import { useEffect, useState } from 'react'

import { Modal } from "../Common";
import autosize from 'autosize';
import { pushNotification } from '../../features/notification/notificationSlice';
import { useDispatch } from 'react-redux';

const ExerciseTestsTab = (props: any) => {

    const NEW_TEST_NAME = "New Test";

    const { exerciseIsSuccess, isOwner, exercise_id } = props

    const [createTest] = useCreateTestMutation();
    const [deleteTest] = useDeleteTestMutation();
    const [editTest, setEditTest] = useState(false);
    const [editTestId, setEditTestId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [tests, setTests] = useState([] as any[]);
    const [updateTest] = useUpdateTestMutation();
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //used to generate unique ids for tests
    const dispatch = useDispatch();

    const {
        data: testsResponse,
    } = useGetTestsOfExerciseQuery({ exercise_id });


    useEffect(() => {
        setTests(testsResponse);
    }, [testsResponse]);

    useEffect(() => {
        autosize(document.querySelectorAll('textarea'));
    }, [tests]);


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
                .unwrap()
                .then(() => {
                    dispatch(pushNotification({
                        message: "Test created successfully",
                        type: "success",
                    }));
                })
                .catch((error) => {
                    dispatch(pushNotification({
                        message: "There was an error creating the test",
                        type: "error",
                    }));
                });
            // set test as not new
            setTests(tests.map((t: any) => t.id === testId ? { ...t, new: false } : t))
        } else {
            await updateTest({
                id: test.id,
                exercise: exercise_id,
                name: test.name,
                stdin: test.stdin,
                stdout: test.stdout
            })
                .unwrap()
                .then(() => {
                    dispatch(pushNotification({
                        title: "Success",
                        message: "Test updated successfully",
                        type: "success",
                    }));
                })
                .catch((error) => {
                    dispatch(pushNotification({
                        message: "There was an error updating the test",
                        type: "error",
                    }));
                });
        }
    }

    const handleDeleteConfirmation = async () => {
        const test = tests.filter((t: any) => t.id === editTestId)[0];
        if (!test?.new) {
            await deleteTest({ id: editTestId })
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
        setTests(tests.filter((t: any) => t.id !== editTestId));
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
                        <div className="bg-gray-50 border shadow p-6 md:p-2 flex justify-center items-center flex-col rounded-lg">
                            <h6 className="text-muted p-2 md:p-4">This exercise doesn't have any tests</h6>
                            {isOwner && (
                                <div className="flex justify-center p-2 md:p-2">
                                    <button
                                        className="inline-flex items-center text-primary text-sm btn-link bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                        onClick={(e) => {
                                            const randomId = Array(16)
                                                .join()
                                                .split(",")
                                                .map(function () {
                                                    return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                                                })
                                                .join("");
                                            setTests([...tests, { id: randomId, name: NEW_TEST_NAME, stdin: "", stdout: "", new: true }]);
                                        }}
                                    >
                                        <PlusIcon className="mr-2 w-6 h-6" />
                                        Create test
                                    </button>
                                </div>

                            )}
                        </div>

                    )}

                    {tests.map((test) => (
                        <div
                            key={test?.id}
                            className={`mb-6 w-full`}
                            tabIndex={0}
                            onFocus={() => {
                                isOwner && setEditTestId(test?.id);
                                setEditTest(true);
                            }}
                            onBlur={(e: any) => {
                                if (!e.currentTarget.contains(e.relatedTarget)) {
                                    isOwner && setEditTestId(null);
                                    setEditTest(false);
                                }
                            }}
                        >
                            <div className={`flex flex-col w-full gap-2 ${editTest && editTestId === test.id ? "border-blue-600" : "border-gray-200"} border-l-2 border-gray-200 pl-4`}>
                                <div className='w-full flex items-center'>
                                    <span className='pr-3 py-2'>Title</span>
                                    <input
                                        type="text"
                                        placeholder="Test name"
                                        aria-label="Test name"
                                        value={test?.name}
                                        autoComplete="off"
                                        className={`w-full rounded-lg p-2 text-gray-700 border focus:outline-none focus:border-blue-500`}
                                        onChange={(e) => {
                                            isOwner && setTests(
                                                tests.map((t) =>
                                                    t.id === test?.id ? { ...t, name: e.target.value } : t
                                                ));
                                        }}
                                        {...(editTest && editTestId === test?.id ? {} : { disabled: true, readOnly: true })}
                                    />
                                </div>

                                <div className="w-full flex items-center">
                                    <span className="pr-3 py-2 rounded-l-lg">Input</span>
                                    <textarea
                                        className="border rounded-lg w-full form-control focus:outline-none focus:border-blue-500 h-10 p-2 font-mono"
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
                                        {...(editTest && editTestId === test?.id ? {} : { disabled: true, readOnly: true })}
                                    />
                                </div>

                                <div className="w-full flex items-center">
                                    <span className="pr-3 py-2 rounded-l-lg">Output</span>
                                    <textarea
                                        className="border rounded-lg w-full form-control focus:outline-none focus:border-blue-500 h-10 p-2 font-mono"
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
                                        {...(editTest && editTestId === test?.id ? {} : { disabled: true, readOnly: true })}
                                    />
                                </div>
                                <div className="inline-flex justify-start gap-2">
                                    <button
                                        className="font-medium focus:outline-none text-blue-500 border border-blue-500 hover:bg-blue-50 rounded-lg px-3 py-1.5 transition-all duration-300 flex items-center"
                                        onClick={() => {
                                            handleCreateOrUpdateTest(test?.id);
                                            setEditTest(false);
                                        }}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        <span className='ml-2'>Save</span>
                                    </button>
                                    <button
                                        className="font-medium focus:outline-none text-red-500 border border-red-500 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-all duration-300 flex items-center"
                                        onClick={() => test?.name !== NEW_TEST_NAME || test?.stdin || test?.stdout ? setShowModal(true) : handleDeleteConfirmation()}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        <span className='ml-2'>Delete</span>
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-auto">
                                {editTest && editTestId === test?.id ? (
                                    <>
                                        {showModal && (
                                            <Modal
                                                title={<h2 className="text-xl font-semibold">Confirmation</h2>}
                                                icon={<ExclamationTriangleIcon className="text-yellow-500 w-12 h-12 mb-2" />}
                                                decription={<p className="mb-4">Are you sure you want to delete this test?</p>}
                                                handleCloseModal={() => setShowModal(false)}
                                                delete={handleDeleteConfirmation}
                                            />

                                        )}
                                    </>
                                ) : null}
                            </div>
                        </div>
                    ))}
                    {isOwner && tests.length > 0 && (
                        <div className="flex justify-center mt-6">
                            <button
                                className="w-full inline-flex items-center text-primary text-sm border bg-gray-50 hover:bg-gray-100 font-semibold py-2 px-2 rounded-lg focus:outline-none focus:shadow-outline"
                                onClick={(e) => {
                                    const randomId = Array(16)
                                        .join()
                                        .split(",")
                                        .map(function () {
                                            return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                                        })
                                        .join("");
                                    setTests([...tests, { id: randomId, name: "New Test", stdin: "", stdout: "", new: true }]);
                                    setEditTestId(randomId as any);
                                    setEditTest(true);
                                }}
                            >
                                <PlusIcon className="mr-2 w-4 h-4" />
                                Add test
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );

}

export default ExerciseTestsTab