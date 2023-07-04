import { ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Modal, Tabs } from "../Common";
import { useDeleteExerciseMutation, useGetExerciseQuery, useUpdateExerciseMutation } from "../../features/courses/exerciseApiSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumb from "../Common/Breadcrumb";
import EditableDescription from "../Common/EditableContent/EditableDescription";
import EditableTitle from "../Common/EditableContent/EditableTitle";
import ExerciseRuntimeTab from "./ExerciseRuntimeTab";
import ExerciseSubmissionTab from "./ExerciseSubmissionTab";
import ExerciseTestsTab from "./ExerciseTestsTab";
import Header from "../Common/Header";
import { pushNotification } from "../../features/notification/notificationSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Exercise = () => {

    const [deleteExercise] = useDeleteExerciseMutation();
    const [description, setDescription] = useState("");
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
        isError: exerciseIsError,
    } = useGetExerciseQuery({ id: exercise_id });

    const session = exercise?.session
    const course = session?.course
    const isOwner = course?.owners?.map((o: any) => o.username).includes(username);
    const isTutor = course?.tutors?.map((t: any) => t.username).includes(username);

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
                    message: "The session has been deleted",
                    type: "success"
                }));
                navigate(`/session/${session.id}`)
            })
            .catch((e) => {
                dispatch(pushNotification({
                    message: "Something went wrong. The session has not been deleted",
                    type: "error"
                }));
            })
    }

    // Delete button (teacher only)
    const OwnerButtons = () => {
        return isOwner ? (
            <div className="">
                <button
                    onClick={() => setModalIsOpen(true)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                >
                    <TrashIcon className="w-6 h-6" />
                </button>
            </div>
        ) : null;
    };

    if (exerciseIsError) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The exercise you are looking for doesn't exist, <br />or you aren't allowed to access it.<br /><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        )
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
            content: <ExerciseRuntimeTab course={course} session={session} exercise={exercise} isOwner={isOwner} />,
        },
        {
            key: "submission",
            title: "Submission",
            content: <ExerciseSubmissionTab exercise={exercise} />,
        },
    ];

    return exerciseIsLoading ? (
        <></>
    ) : (<>

        <Header />

        <br />
        <br />

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
                        handleUpdate={handleUpdate}
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
                description={description}
                handleUpdate={handleUpdate}
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
    </>)
}

export default Exercise
