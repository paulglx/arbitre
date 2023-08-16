import { ExclamationTriangleIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useCreateTestMutation, useDeleteTestMutation, useGetTestsOfExerciseQuery, useUpdateTestMutation } from "../../features/courses/testApiSlice";
import { useEffect, useState } from 'react'

import { Modal } from "../Common";

const ExerciseTestsTab = (props: any) => {

    const { exerciseIsSuccess, isOwner, exercise_id } = props

    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //used to generate unique ids for tests
    const [tests, setTests] = useState([] as any[]);
    const [editTest, setEditTest] = useState(false);
    const [editTestId, setEditTestId] = useState(null);
    const [hoveredTestId, setHoveredTestId] = useState(-1);
    const [createTest] = useCreateTestMutation();
    const [updateTest] = useUpdateTestMutation();
    const [deleteTest] = useDeleteTestMutation();
    const [showModal, setShowModal] = useState(false);

    const {
        data: testsResponse,
    } = useGetTestsOfExerciseQuery({ exercise_id });


    useEffect(() => {
        setTests(testsResponse);
    }, [testsResponse]);


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
        }
    }

    const handleDeleteConfirmation = async () => {
        try {
            await deleteTest({ id: editTestId });
            setTests(tests.filter((t: any) => t.id !== editTestId));
        } catch (error) {
            console.log(error);
        }
        setShowModal(false);
    };


    //Prevent blurring test div when focusing one of its inputs
    const handleTestBlur = (e: any) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setEditTest(false);
            handleCreateOrUpdateTest(editTestId);
        }
    }

    return (
        <div className='pb-3'>
            {exerciseIsSuccess && tests && (
                <>
                    {tests.length > 0 ? (
                        <h6 className="text-sm px-1 mb-1 text-gray-500">
                            {isOwner ? "Click test to edit" : "Tests can be edited by owners"}
                        </h6>
                    ) : (
                        <div className="bg-gray-50 border shadow p-6 md:p-2 flex justify-center items-center flex-col rounded-lg">
                            <h6 className="text-muted p-2 md:p-4">This exercise doesn't have any tests</h6>
                            {isOwner && (
                                <div className="flex justify-center p-2 md:p-2">
                                    <button
                                        className="inline-flex items-center text-primary text-sm btn-link bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                        id="create-test-button"
                                        onClick={(e) => {
                                            const randomId = Array(16)
                                                .join()
                                                .split(",")
                                                .map(function () {
                                                    return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                                                })
                                                .join("");
                                            setTests([...tests, { id: randomId, name: "New Test", stdin: "", stdout: "", new: true }]);
                                        }}
                                    >
                                        <PlusCircleIcon className="mr-2 w-6 h-6" />
                                        Create test
                                    </button>
                                </div>

                            )}
                        </div>

                    )}

                    {tests.map((test) => (
                        <div
                            key={test?.id}
                            className={`test-name-input-wrapper mb-2 w-full`}
                            tabIndex={0}
                            onFocus={() => {
                                isOwner && setEditTestId(test?.id);
                                setEditTest(true);
                            }}
                            onBlur={(e) => { isOwner && handleTestBlur(e); }}
                            onMouseEnter={() => { isOwner && setHoveredTestId(test?.id); }}
                            onMouseLeave={() => { isOwner && setHoveredTestId(-1); }}
                        >
                            <div className="flex items-center w-full gap-2 flex-col md:flex-row">
                                <input
                                    type="text"
                                    placeholder="Test name"
                                    aria-label="Test name"
                                    value={test?.name}
                                    autoComplete="off"
                                    className={`w-full md:w-1/2 rounded-lg py-2 px-3 text-gray-700 border focus:outline-none focus:border-blue-500`}
                                    onChange={(e) => {
                                        isOwner && setTests(
                                            tests.map((t) =>
                                                t.id === test?.id ? { ...t, name: e.target.value } : t
                                            ));
                                    }}
                                    {...(editTest && editTestId === test?.id ? {} : { disabled: true, readOnly: true })}
                                />

                                <div className="md:w-1/4 w-full flex items-center md:ml-1 border rounded-lg border-gray-300 bg-gray-200">
                                    <span className="bg-gray-200 px-3 py-2 rounded-l-lg">Input</span>
                                    <textarea
                                        className="w-full form-control border-0 rounded-r-lg focus:outline-none focus:border-blue-500 ml-2 md:ml-4 bg-white h-10 p-2"
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

                                <div className="md:w-1/4 w-full flex items-center md:ml-1 border rounded-lg border-gray-300 bg-gray-200">
                                    <span className="bg-gray-200 px-3 py-2 rounded-l-lg">Output</span>
                                    <textarea
                                        className="w-full form-control border-0 rounded-r-lg focus:outline-none focus:ring-0 ml-2 md:ml-4 bg-white h-10 p-2"
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
                                <div className="inline-flex justify-end">
                                    <button
                                        className="font-medium focus:outline-none bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 md:py-3 mb-2 md:mb-0 transition-all duration-300 flex items-center"
                                        onClick={() => setShowModal(true)}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        <span className='md:hidden block ml-2'>Delete</span>
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-auto">
                                {(editTest && editTestId === test?.id) || hoveredTestId === test?.id ? (
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
                        <div className="flex justify-center mt-6 md:mt-2">
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
                                    setTests([...tests, { id: randomId, name: "New Test", stdin: "", stdout: "", new: true }]);
                                }}
                            >
                                <PlusCircleIcon className="mr-2 w-6 h-6" />
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