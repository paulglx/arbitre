import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { useDeleteExerciseMutation, useGetExerciseQuery, useUpdateExerciseMutation } from "../../features/courses/exerciseApiSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumb from "../Common/Breadcrumb";
import CSELoading from "../Common/CSE/CSELoading";
import CSEOwnerActions from "../Common/CSE/CSEOwnerActions";
import EditableDescription from "../Common/EditableContent/EditableDescription";
import EditableTitle from "../Common/EditableContent/EditableTitle";
import ExerciseRuntimeTab from "./ExerciseRuntimeTab";
import ExerciseSubmissionTab from "./Submission/ExerciseSubmissionTab";
import ExerciseTestsTab from "./ExerciseTestsTab";
import NotFound from "../Util/NotFound";
import { Tabs } from "../Common";
import { pushNotification } from "../../features/notification/notificationSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRequeueSubmissionsMutation } from "../../features/submission/submissionApiSlice";
import { useSelector } from "react-redux";
import { useTitle } from "../../hooks/useTitle";

const Exercise = () => {

    const [actionsDropdown, setActionsDropdown] = useState(false);
    const [deleteExercise] = useDeleteExerciseMutation();
    const [description, setDescription] = useState("");
    const [edit, setEdit] = useState(false);
    const [prefix, setPrefix] = useState("");
    const [requeueSubmissions] = useRequeueSubmissionsMutation();
    const [suffix, setSuffix] = useState("");
    const [title, setTitle] = useState("");
    const [updateExercise] = useUpdateExerciseMutation();
    const { exercise_id }: any = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector(selectCurrentUser);

    const {
        data: exercise,
        isLoading: exerciseIsLoading,
        isSuccess: exerciseIsSuccess,
    } = useGetExerciseQuery({ id: exercise_id });

    const session = exercise?.session
    const course = session?.course
    const isOwner = course?.owners?.map((o: any) => o.username).includes(username);
    const isTutor = course?.tutors?.map((t: any) => t.username).includes(username);

    useTitle(exercise?.title);

    useEffect(() => {

        if (exerciseIsSuccess) {
            if (exercise?.title === "" && exercise?.description === "") {
                setEdit(true);
            }

            setTitle(exercise?.title);
            setDescription(exercise?.description);
            setPrefix(exercise?.prefix);
            setSuffix(exercise?.suffix);
        }
    }, [exercise, exerciseIsSuccess]);

    const handleUpdate = async () => {
        await updateExercise({
            id: exercise_id,
            title,
            description,
            session_id: session.id,
            prefix,
            suffix
        })
            .unwrap()
            .then(() => {
                dispatch(pushNotification({
                    message: "The exercise has been updated",
                    type: "success"
                }));
            })
            .catch((e) => {
                dispatch(pushNotification({
                    message: "Something went wrong. The exercise has not been updated",
                    type: "error"
                }));
            })
    }

    const handleDelete = async (e: any) => {
        e.preventDefault();
        await deleteExercise({ id: exercise_id })
            .unwrap()
            .then(() => {
                dispatch(pushNotification({
                    message: "The exercise has been deleted",
                    type: "success"
                }));
                navigate(`/session/${session.id}`)
            })
            .catch((e) => {
                dispatch(pushNotification({
                    message: "Something went wrong. The exercise has not been deleted",
                    type: "error"
                }));
            })
    }

    const handleRequeue = async (e: any) => {
        e.preventDefault();
        await requeueSubmissions({ exercise_id: exercise?.id })
            .unwrap()
            .then(() => {
                dispatch(pushNotification({
                    message: "Submissions will be re-run in less than 10 seconds.",
                    type: "success"
                }));
            })
            .catch(() => {
                dispatch(pushNotification({
                    message: "Something went wrong. Submissions have not been requeued",
                    type: "error"
                }));
            })
    }

    const ActionsDropdown = () => {
        return isTutor || isOwner ? (<>
            <button
                id="dropdownDefaultButton"
                className="rounded-lg border shadow-sm text-semibold px-5 py-2.5 text-center inline-flex items-center"
                type="button"
                aria-haspopup="true"
                aria-expanded={actionsDropdown}
                onClick={() => setActionsDropdown(!actionsDropdown)}
            >
                Actions&nbsp;
                {actionsDropdown ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>

            {actionsDropdown && (

                <div id="dropdown" className="absolute mt-14 border z-10 bg-white divide-y divide-gray-100 rounded-lg shadow">
                    <ul className="py-2 text-gray-700" aria-labelledby="dropdownDefaultButton">
                        <li>

                            <button
                                className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                                onClick={() => navigate(`/dashboard/${session?.id}`)}
                            >
                                <TableCellsIcon className="h-5 w-5 inline-block mr-2" />
                                View in Dashboard
                            </button>

                            <button
                                className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                                onClick={handleRequeue}
                            >
                                <ArrowPathIcon className="h-5 w-5 inline-block mr-2" />
                                Re-run tests on all submissions
                            </button>

                        </li>
                    </ul>
                </div>

            )}
        </>) : null;
    }


    const tabs = [
        {
            key: "tests",
            title: "Tests",
            content: <ExerciseTestsTab exercise_id={exercise?.id} isOwner={isOwner} exerciseIsSuccess={exerciseIsSuccess} />,
        },
        {
            key: "runtime",
            title: "Runtime",
            content: <ExerciseRuntimeTab edit={edit} course={course} exercise={exercise} isOwner={isOwner} prefix={prefix} suffix={suffix} setPrefix={setPrefix} setSuffix={setSuffix} />,
        },
        {
            key: "submission",
            title: "Submission",
            content: <ExerciseSubmissionTab exercise={exercise} />,
        },
    ];

    if (exerciseIsLoading) {
        return (<CSELoading />)
    }

    return exerciseIsSuccess ? (<>

        <div className="container mx-auto">

            <Breadcrumb items={[
                { title: "Courses", link: "/course" },
                { title: course.title, link: "/course/" + course.id },
                { title: session.title, link: "/session/" + session.id },
                { title: exercise.title, link: null }
            ]} />

            <br />

            <div className="flex items-center justify-between">
                <div className="w-full">
                    <EditableTitle
                        edit={edit}
                        isOwner={isOwner}
                        setTitle={setTitle}
                        title={title}
                    />
                </div>
                <div className="flex gap-2">
                    <CSEOwnerActions
                        edit={edit}
                        isOwner={isOwner}
                        setEdit={setEdit}
                        handleUpdate={handleUpdate}
                        handleDelete={handleDelete}
                    />
                    <ActionsDropdown />
                </div>
            </div>

            <EditableDescription
                edit={edit}
                description={description}
                isOwner={isOwner}
                setDescription={setDescription}
            />

            {isOwner || isTutor ? (<>
                <Tabs tabs={tabs} />
            </>) : (<>
                <ExerciseSubmissionTab exercise={exercise} username={username} />
            </>)}
        </div>
    </>) : (
        <NotFound />
    )
}

export default Exercise
