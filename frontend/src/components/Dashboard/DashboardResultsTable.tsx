import { useEffect, useMemo, useState } from "react";

import DashboardResultsTableLoading from "./DashboardResultsTableLoading";
import GradeBadge from "../Util/GradeBadge";
import { Link } from "react-router-dom";
import StatusBadge from "../Util/StatusBadge";
import TestResult from "../Exercise/TestResult/TestResult";
import { XMarkIcon } from "@heroicons/react/24/solid"
import { useGetExercisesOfSessionQuery } from "../../features/courses/exerciseApiSlice";
import { useGetResultsOfSessionQuery } from "../../features/results/resultsApiSlice";

const DashboardResultsTable = (props: any) => {

    const [modalContent, setModalContent] = useState(<></>)
    const [showModal, setShowModal] = useState(false)
    const [isVisible, setIsVisible] = useState(document.visibilityState === "visible")
    const session_id = props.sessionId;
    const groups = props.selectedGroups;

    const onVisibilityChange = () => {
        setIsVisible(document.visibilityState === "visible")
    };

    useEffect(() => {
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    }, []);

    const {
        data: results,
        isSuccess: isResultsSuccess,
        isLoading: isResultsLoading,
    } = useGetResultsOfSessionQuery({ session_id, groups }, {
        pollingInterval: showModal || !isVisible ? 0 : 1000,
    });

    const resultsSortedByUsername = useMemo(() => {
        if (!results) return
        const resultsToSort = structuredClone(results)
        const sortedResults = resultsToSort.sort((a: any, b: any) => { return a.username.localeCompare(b.username) })

        for (let idx = 0; idx < sortedResults.length; idx++) {
            sortedResults[idx]?.exercises?.sort((a: any, b: any) => a.exercise_title.localeCompare(b.exercise_title))
        }

        return sortedResults
    }, [results])

    const {
        data: exercises,
        isSuccess: exercisesIsSuccess,
    } = useGetExercisesOfSessionQuery({ session_id });

    const sortedExercises = useMemo(() => {
        if (exercisesIsSuccess) {
            const exercisesToSort = structuredClone(exercises);
            exercisesToSort.sort((a: any, b: any) => {
                return a.title.localeCompare(b.title);
            });
            return exercisesToSort;
        }
        return exercises;
    }, [exercises, exercisesIsSuccess]);

    const truncateTitle = (title: string) => {
        if (title.length > 20) {
            return title.substring(0, 20) + "...";
        }
        return title;
    }

    const modal = (exercise: any, student: any) => {
        return (
            <div
                id="detailsModal"
                aria-hidden={!showModal}
                className="fixed grid place-items-center z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0 h-screen max-h-full bg-gray-900 bg-opacity-50"
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

                        <div className="p-4 pb-3">
                            <TestResult exercise_id={exercise.exercise_id} user_id={student.user_id} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const tableHeadContent = (results: any) => {
        return results[0]?.exercises.length > 0 ? (
            <thead
                className="w-full text-gray-800 bg-gray-100 rounded-lg table-auto"
            >
                <tr key={-1} className="">
                    <th key={-1}>Student</th>
                    {results[0]?.exercises?.map(
                        (exercise: any, i: number) => (
                            <th scope="col" className="truncate py-3 px-2 w-48 border-l border-gray-200" key={i} >
                                <Link
                                    to={`/exercise/${exercise.exercise_id}`}
                                    className="no-underline hover:underline"
                                >
                                    {truncateTitle(exercise.exercise_title)}
                                </Link>
                            </th>
                        )
                    )}
                    <th className="border bg-blue-100 text-blue-700 w-48 min-w-48">Student&nbsp;grade</th>
                </tr>
            </thead >

        ) : (
            <></>
        );
    };

    const tableBodyContent = (results: any) => {
        return results[0]?.exercises.length > 0 ? (
            <tbody className="w-full">
                {results.map((student: any, i: number) => {
                    var finalSessionGrade = 0;
                    var sessionGrade = 0;

                    return (
                        <tr key={i} className="border-t hover:bg-gray-50">
                            <td key={-1} className="px-2 py-3 bg-gray-50 border-r border-gray-200">
                                {student.username}
                            </td>
                            {student.exercises.map((exercise: any, j: number) => {
                                const exerciseGrade = sortedExercises ? sortedExercises[j].grade : 0;
                                let sumOfCoefficient = 0;
                                let dividendTestGrade = 0;

                                sessionGrade += exerciseGrade;

                                student.exercises[j].testResults.forEach((testResult: any) => {
                                    sumOfCoefficient += testResult.exercise_test.coefficient || 0;
                                    if (testResult?.status === "success") {
                                        dividendTestGrade += exerciseGrade * (testResult.exercise_test.coefficient || 0);
                                    }
                                });

                                let finalExerciseGrade = 0;
                                if (sumOfCoefficient !== 0) {
                                    finalExerciseGrade = dividendTestGrade / sumOfCoefficient;
                                }

                                finalSessionGrade += finalExerciseGrade;

                                return (
                                    <td
                                        className={`text-center py-3 border-l ${exercise.status === "not submitted" ? "cursor-default" : "cursor-pointer hover:bg-gray-100"} `}
                                        role={exercise.status !== "not submitted" ? "button" : ""}
                                        key={j}
                                        onClick={exercise.status !== "not submitted" ? () => {
                                            setModalContent(modal(exercise, student));
                                            setShowModal(true);
                                        } : undefined}>
                                        <div className="flex justify-between px-2 items-center">
                                            {["success", "failed", "error"].includes(exercise.status) && exerciseGrade
                                                ? <>
                                                    <StatusBadge status={exercise.status} late={exercise.late} />
                                                    <GradeBadge grade={finalExerciseGrade} total={exerciseGrade} />
                                                </>

                                                : <div className="mx-auto">
                                                    <StatusBadge status={exercise.status} late={exercise.late} />
                                                </div>
                                            }
                                        </div>
                                    </td>
                                );
                            })}
                            <td className="text-center border-l border-gray-200 bg-blue-50">
                                <GradeBadge grade={finalSessionGrade} total={sessionGrade} />
                            </td>
                        </tr>)
                }
                )}
            </tbody >
        ) : (
            <tbody>
                <tr>
                    <td>
                        <p className="p-2 bg-gray-50">
                            <span className="font-semibold">No results found. </span>
                            <br></br>
                            <span className="text-gray-600 text-sm">
                                Make sure there are exercises in the session, and students registered on the course. <br />
                                To see your own results here, register yourself as a student on this course.
                            </span>
                        </p>
                    </td>
                </tr>
            </tbody>
        );
    };

    const LiveBadge = () => {
        return isResultsSuccess ? (<div className="mb-4 mt-1">
            <span className="inline-flex items-center border-green-400 text-green-700 text-sm font-medium mr-2 px-1.5 rounded-lg">
                <span className="relative inline-flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                &nbsp;Live results
            </span>
        </div>) : (<></>);
    }

    const StudentCount = () => {

        const studentCount = results?.length || 0;

        return isResultsSuccess ? (
            <div className="text-xs text-gray-500 px-1 pb-2">
                Showing {studentCount} student{studentCount !== 1 ? "s" : ""}
            </div>
        )
            : (<></>);
    }

    return isResultsSuccess ? (<>

        {showModal ? modalContent : null}

        <br />

        <StudentCount />

        <div className='mx-auto overflow-x-auto rounded-md'>

            <table className="w-full text-sm rounded border">
                {tableHeadContent(resultsSortedByUsername)}
                {tableBodyContent(resultsSortedByUsername)}
            </table>
        </div>

        <LiveBadge />
    </>) : isResultsLoading ? (<>

        <br />

        <DashboardResultsTableLoading />

    </>)
        : (
            <p className="px-4 py-2 mt-2 border rounded-md text-red-500 bg-red-50 border-red-200">
                Unable to fetch results.
            </p>
        );
};

export default DashboardResultsTable;
