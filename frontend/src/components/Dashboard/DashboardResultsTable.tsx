import StatusBadge from "../Util/StatusBadge";
import TestResult from "../Exercise/TestResult/TestResult";
import { XMarkIcon } from "@heroicons/react/24/solid"
import { useGetResultsOfSessionQuery } from "../../features/results/resultsApiSlice";
import { useState } from "react";

const DashboardResultsTable = (props: any) => {

    const [modalContent, setModalContent] = useState(<></>)
    const [showModal, setShowModal] = useState(false)
    const session_id = props.session_id;

    const {
        data: results,
        isSuccess: isResultsSuccess,
    } = useGetResultsOfSessionQuery({ session_id });

    const modal = (exercise: any, student: any) => {
        return (
            <div
                id="detailsModal"
                aria-hidden={!showModal}
                className="fixed grid place-items-center z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen max-h-full bg-gray-900 bg-opacity-50"
            >
                <div className="relative w-full max-w-4xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow border">

                        <div className="flex items-start justify-between px-4 py-3 border-b rounded-t bg-gray-50">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {exercise.exercise_title} - {student.username}
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 mt-1 rounded-lg text-sm ml-auto inline-flex items-center"
                                onClick={() => {
                                    setShowModal(false)
                                }}

                            >
                                <XMarkIcon className="w-6 h-6" />
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <TestResult exercise_id={exercise.exercise_id} user_id={student.user_id} />
                    </div>
                </div>
            </div>
        );
    };

    const tableHeadContent = (results: any) => {
        return results[0]?.exercises.length > 0 ? (
            <thead
                className="text-gray-800 bg-gray-100 rounded-lg"
            >
                <tr key={-1} className="">
                    <th key={-1} className="w-24">Student</th>
                    {results[0]?.exercises?.map(
                        (exercise: any, i: number) => (
                            <th scope="col" className="truncate py-3 px-2 w-32 border-l border-gray-200" key={i}>
                                {exercise.exercise_title}
                            </th>
                        )
                    )}
                </tr>
            </thead>
        ) : (
            <></>
        );
    };

    const tableBodyContent = (results: any) => {
        return results[0]?.exercises.length > 0 ? (
            <tbody>
                {results.map((student: any, i: number) => (
                    <tr
                        key={i}
                        className="border-t hover:bg-gray-50"
                    >
                        <td
                            key={-1}
                            className="px-2 py-4 bg-gray-50 border-r border-gray-200"
                        >
                            {student.username}
                        </td>
                        {student.exercises.map((exercise: any, j: number) => (
                            <td
                                className='text-center cursor-pointer py-4'
                                role={exercise.status !== "not submitted" ? "button" : ""}
                                key={j}
                                onClick={exercise.status !== "not submitted" ? (() => {
                                    setModalContent(modal(exercise, student))
                                    setShowModal(true)
                                }) : (
                                    undefined
                                )}
                            >
                                <StatusBadge status={exercise.status} />
                            </td>
                        ))
                        }
                    </tr >
                ))
                }
            </tbody >
        ) : (
            <tbody>
                <tr>
                    <td>
                        <p className="p-2">
                            No results found. <br></br>
                            <span className="text-muted small">
                                Make sure there are exercises in the session, and students registered on the course. <br />
                                To see your own results here, register yourself as a student on this course.
                            </span>
                        </p>
                    </td>
                </tr>
            </tbody>
        );
    };

    return isResultsSuccess ? (<>

        {showModal ? modalContent : null}

        <br />

        <div className='mx-auto overflow-x-auto rounded-md'>
            <table className="w-full text-sm rounded border">
                {tableHeadContent(results)}
                {tableBodyContent(results)}
            </table>
        </div>
    </>) : (
        <p className="px-4 py-2 mt-2 border rounded-md text-red-500 bg-red-50 border-red-200">
            Unable to fetch results.
        </p>
    );
};

export default DashboardResultsTable;