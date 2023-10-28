import { ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Modal, Tabs } from "../Common";
import { useDeleteExerciseMutation, useGetExerciseQuery, useUpdateExerciseMutation } from "../../features/courses/exerciseApiSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumb from "../Common/Breadcrumb";
import CSELoading from "../Common/CSELoading";
import EditableDescription from "../Common/EditableContent/EditableDescription";
import EditableTitle from "../Common/EditableContent/EditableTitle";
import ExerciseRuntimeTab from "./ExerciseRuntimeTab";
import ExerciseSubmissionTab from "./ExerciseSubmissionTab";
import ExerciseTestsTab from "./ExerciseTestsTab";
import NotFound from "../Util/NotFound";
import { pushNotification } from "../../features/notification/notificationSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useTitle } from "../../hooks/useTitle";

const Exercise = () => {

    const [deleteExercise] = useDeleteExerciseMutation();
    const [description, setDescription] = useState("");
    const [edit, setEdit] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [prefix, setPrefix] = useState("");
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
        setTitle(exercise?.title);
        setDescription(exercise?.description);
        setPrefix(exercise?.prefix);
        setSuffix(exercise?.suffix);
    }, [exercise]);

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

    // Edit and Delete buttons (only visible to owners)
    const OwnerButtons = () => {
        return isOwner ? (
            <div className="flex flex-row gap-2 ml-1">
                {edit ? (
                    <button
                        onClick={() => {
                            setEdit(false);
                            handleUpdate();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white border font-semibold py-2 px-4 rounded"
                        aria-label='Cancel edit'
                    >
                        Save
                    </button>) : (
                    <button
                        onClick={() => setEdit(true)}
                        className="border font-semibold py-2 px-4 rounded hover:bg-gray-50"
                        aria-label='Edit exercise'
                    >
                        Edit
                    </button>)}
                <button
                    onClick={() => setModalIsOpen(true)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                    aria-label='Delete exercise'
                    aria-haspopup="true"

                >
                    <TrashIcon className="w-6 h-6" />

                </button>
            </div>

        ) : null;
    };

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
                    <OwnerButtons />
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

            {modalIsOpen &&
                <Modal
                    title={<h2 className="text-xl font-semibold">Are you sure?</h2>}
                    icon={<ExclamationTriangleIcon className="text-yellow-500 w-12 h-12 mb-2" />}
                    decription={<p className="mb-4">This will permanently remove this exercise.</p>}
                    handleCloseModal={() => setModalIsOpen(false)}
                    delete={handleDelete}
                />
            }
        </div>
    </>) : (
        <NotFound />
    )
}

export default Exercise
