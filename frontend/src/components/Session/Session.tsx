import { ChevronDownIcon, ChevronUpIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteSessionMutation, useGetSessionQuery, useUpdateSessionMutation } from "../../features/courses/sessionApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Breadcrumb from '../Common/Breadcrumb';
import CSELoading from '../Common/CSE/CSELoading';
import CSEOwnerActions from "../Common/CSE/CSEOwnerActions";
import { ClockIcon } from "@heroicons/react/24/outline";
import DashboardResultsTable from "../Dashboard/DashboardResultsTable";
import EditableDescription from "../Common/EditableContent/EditableDescription";
import EditableTitle from '../Common/EditableContent/EditableTitle';
import ExerciseContent from "./SessionComponents/ExerciseContent";
import SessionSchedule from "./SessionComponents/SessionSchedule";
import { Tabs } from "../Common/";
import moment from "moment";
import { pushNotification } from "../../features/notification/notificationSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useTitle } from '../../hooks/useTitle';

const Session = () => {

    const [actionsDropdown, setActionsDropdown] = useState(false);
    const [deleteSession] = useDeleteSessionMutation();
    const [description, setDescription] = useState("");
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [updateSession] = useUpdateSessionMutation();
    const { session_id }: any = useParams();
    const [startDate, setStartDate] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector(selectCurrentUser);

    const {
        data: session,
        isLoading: sessionIsLoading,
        isSuccess: sessionIsSuccess,
        isError: sessionIsError,
        refetch: refetchSession,
    } = useGetSessionQuery({ id: session_id });

    const course = session?.course;
    const isOwner = session?.course?.owners?.map((o: any) => o.username).includes(username);
    const isTutor = session?.course?.tutors?.map((t: any) => t.username).includes(username);

    useTitle(session?.title);

    useEffect(() => {
        if (sessionIsSuccess) {
            if (session?.title === "" && session?.description === "") {
                setEdit(true);
            }

            setTitle(session?.title);
            setDescription(session?.description);
            if (session?.start_date) {
                setStartDate(moment(session?.start_date).format("YYYY-MM-DDTHH:mm"));
            } else {
                setStartDate("");
            }

        }
    }, [session, sessionIsSuccess]);

    const handleUpdate = async () => {

        // Correct start_date format for Django
        const startDateFormatted = startDate === "" ? null : moment(startDate).format("YYYY-MM-DDTHH:mm:ss.SSSSSSZ");

        console.log(startDateFormatted)

        await updateSession({
            course_id: course?.id,
            id: session?.id,
            title,
            description,
            start_date: startDateFormatted,
        })
            .unwrap()
            .then(() => {
                dispatch(pushNotification({
                    message: "The session has been updated",
                    type: "success"
                }));
                refetchSession();
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

    const ActionsDropdown = () => {
        return isOwner || isTutor ? (<>
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

                <div id="dropdown" className="absolute mt-14 ml-14 border z-10 bg-white divide-y divide-gray-100 rounded-lg shadow">
                    <ul className="py-2 text-gray-700" aria-labelledby="dropdownDefaultButton">
                        <li>

                            <Link
                                className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                                to={`/dashboard/${session?.id}`}
                            >
                                <TableCellsIcon className="h-5 w-5 inline-block mr-2" />
                                View in Dashboard
                            </Link>

                        </li>
                    </ul>
                </div>

            )}
        </>) : null;
    }

    const NotStartedBanner = () => {
        return session.has_started ? null : (
            <div className="flex flex-row items-center px-3 py-2 mt-2 bg-blue-50 rounded-lg border border-blue-200">
                <ClockIcon className="h-5 w-5 inline-block mr-2 text-blue-700" />
                <span className="text-sm leading-5 font-medium text-blue-800">
                    This session is invisible to students.&nbsp;
                </span>
                <span className="text-sm leading-5 text-blue-700">
                    It will start in {moment(session.start_date).toNow(true)}.
                </span>
            </div>
        )
    }


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
        },
        {
            key: "results",
            title: "Results",
            content: <DashboardResultsTable sessionId={session_id} />,
        },
        {
            key: "schedule",
            title: "Schedule",
            content: <SessionSchedule edit={edit} startDate={startDate} setStartDate={setStartDate} isOwner={isOwner} />,
        },
    ];

    return sessionIsLoading ? (
        <CSELoading />
    ) : (
        <>
            <div className="container mx-auto">

                <Breadcrumb items={[
                    { link: "/course", title: "Courses" },
                    { link: `/course/${course?.id}`, title: course?.title },
                    { link: null, title: title },
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
                            isOwner={isOwner}
                            edit={edit}
                            setEdit={setEdit}
                            handleUpdate={handleUpdate}
                            handleDelete={handleDelete}
                        />
                        <ActionsDropdown />
                    </div>
                </div>

                <NotStartedBanner />

                <EditableDescription
                    edit={edit}
                    description={description}
                    isOwner={isOwner}
                    setDescription={setDescription}
                />

                {isOwner || isTutor ? (<>
                    <Tabs tabs={tabs} />
                </>) : (<>
                    <div className='text-xl font-semibold mt-2 md:mt-6'>Exercises</div>
                    <ExerciseContent session={session} />
                </>)}


            </div>
        </>
    )
}

export default Session