import { useDeleteExerciseMutation, useGetExerciseQuery, useUpdateExerciseMutation } from "../../features/courses/exerciseApiSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumb from "../Common/Breadcrumb";
import CSELoading from "../Common/CSE/CSELoading";
import CSEOwnerActions from "../Common/CSE/CSEOwnerActions";
import EditableDescription from "../Common/EditableContent/EditableDescription";
import EditableTitle from "../Common/EditableContent/EditableTitle";
import ExerciseRuntimeTab from "./ExerciseRuntimeTab";
import ExerciseSubmissionTab from "./ExerciseSubmissionTab";
import ExerciseTestsTab from "./ExerciseTestsTab";
import NotFound from "../Util/NotFound";
import { Tabs } from "../Common";
import { pushNotification } from "../../features/notification/notificationSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useTitle } from "../../hooks/useTitle";

const Exercise = () => {

    const [deleteExercise] = useDeleteExerciseMutation();
    const [description, setDescription] = useState("");
    const [edit, setEdit] = useState(false);
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
