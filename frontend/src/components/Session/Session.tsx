import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Header, Modal, Tabs } from "../Common/";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteSessionMutation, useGetSessionQuery, useUpdateSessionMutation } from "../../features/courses/sessionApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import EditableDescription from "../Common/EditableContent/EditableDescription";
import EditableTitle from '../Common/EditableContent/EditableTitle';
import ExerciseContent from "./SessionComponents/ExerciseContent";
import ResultsTable from "../Dashboard/DashboardResultsTable";
import { pushNotification } from "../../features/notification/notificationSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";

const Session = () => {

    const [deleteSession] = useDeleteSessionMutation();
    const [description, setDescription] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [updateSession] = useUpdateSessionMutation();
    const { session_id }: any = useParams();
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const username = useSelector(selectCurrentUser);

    const {
        data: session,
        isLoading: sessionIsLoading,
        isSuccess: sessionIsSuccess,
        isError: sessionIsError,
    } = useGetSessionQuery({ id: session_id });

    const isOwner = session?.course?.owners?.map((o: any) => o.username).includes(username);
    const isTutor = session?.course?.tutors?.map((t: any) => t.username).includes(username);

    const truncateIfLong = (text: string, length: number) => {
        return text.length > length ? text.substring(0, length) + "..." : text;
    }

    useEffect(() => {
        setTitle(session?.title);
        setDescription(session?.description);
    }, [session, sessionIsSuccess]);

    const course = session?.course

    const handleUpdate = async () => {
        await updateSession({
            course_id: course?.id,
            id: session?.id,
            title,
            description,
        })
            .unwrap()
            .then(() => {
                dispatch(pushNotification({
                    message: "The session has been updated",
                    type: "success"
                }));
            })
            .catch((e) => {
                dispatch(pushNotification({
                    message: "Something went wrong. The session has not been updated",
                    type: "error"
                }));
            })
    }

    const handleDelete = async (e: any) => {
        e.preventDefault();
        await deleteSession({ id: session_id })
            .unwrap()
            .then(() => {
                dispatch(pushNotification({
                    message: "The session has been deleted",
                    type: "success"
                }));
                navigate(`/course/${course?.id}`);
            })
            .catch((e) => {
                dispatch(pushNotification({
                    message: "Something went wrong. The session has not been deleted",
                    type: "error"
                }));
            })
    }

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

    if (sessionIsError) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The session you are looking for doesn't exist, <br />or you aren't allowed to access it.<br /><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        )
    }

    const tabs = [
        {
            key: "exercises",
            title: "Exercises",
            content: <ExerciseContent session={session} />,
            buttonClassName: "rounded-l-md"
        },
        {
            key: "results",
            title: "Results",
            content: <ResultsTable session_id={session_id} />,
            buttonClassName: "rounded-r-md"
        },
    ];

    return sessionIsLoading ? (
        <></>
    ) : (
        <>
            <Header />

            <br />
            <br />

            <div className="container mx-auto">

                <nav className="flex px-5 py-3 mt-2 md:mt-6 w-full text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-1">
                        <li className="flex items-center">
                            <Link to="/course" className="flex items-center text-gray-700 hover:text-blue-600">
                                Courses
                            </Link>
                        </li>
                        <li className="flex items-center text-gray-500" aria-current="page">
                            <svg aria-hidden="true" className="w-6 h-6 text-gray-400 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <Link to={`/course/${course?.id}`} className="flex items-center text-gray-700 hover:text-blue-600">
                                {truncateIfLong(course?.title, 20)}
                            </Link>
                        </li>
                        <li className="flex items-center text-gray-500" aria-current="page">
                            <svg aria-hidden="true" className="w-6 h-6 text-gray-400 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            {title}
                        </li>
                    </ol>
                </nav>

                <br />

                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <EditableTitle
                            title={title}
                            setTitle={setTitle}
                            handleUpdate={handleUpdate}
                            isOwner={isOwner}
                        />
                    </div>
                    <div className="flex gap-2">
                        <OwnerButtons />
                    </div>
                    <div className="p-0 mb-2">

                    </div>
                </div>

                <EditableDescription
                    description={description}
                    setDescription={setDescription}
                    handleUpdate={handleUpdate}
                    isOwner={isOwner}
                />

                {isOwner || isTutor ? (<>
                    <Tabs tabs={tabs} />
                </>) : (<>
                    <h2>Exercises</h2>
                    <ExerciseContent session={session} />
                </>)}

                {modalIsOpen &&
                    <Modal
                        title={<h2 className="text-xl font-semibold">Are you sure?</h2>}
                        icon={<ExclamationTriangleIcon className="text-yellow-500 w-12 h-12 mb-2" />}
                        decription={<p className="mb-4">This will permanently remove this session and all of its exercises.</p>}
                        handleCloseModal={() => setModalIsOpen(false)}
                        delete={handleDelete}
                    />
                }


            </div>
        </>
    )
}

export default Session