import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { PlusIcon } from '@heroicons/react/24/solid'
import { pushNotification } from "../../../features/notification/notificationSlice";
// import { ClockIcon } from '@heroicons/react/24/solid'
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { useCreateSessionMutation } from "../../../features/courses/sessionApiSlice";
import { useGetSessionsOfCourseQuery } from "../../../features/courses/sessionApiSlice";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const SessionContent = (props: any) => {

    const [createSession] = useCreateSessionMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const username = useSelector(selectCurrentUser);
    const ownersUsernames = props.course?.owners?.map((owner: any) => owner.username);
    const isOwner = ownersUsernames?.includes(username);

    const {
        data: sessions,
        isLoading: sessionsIsLoading,
        isSuccess: sessionsIsSuccess,
        isError: sessionsIsError,
    } = useGetSessionsOfCourseQuery({ course_id: props.id })

    const sortedSessions = useMemo(() => {
        if (sessionsIsSuccess) {
            const sessionsToSort = structuredClone(sessions);
            sessionsToSort.sort((a: any, b: any) => {
                return a.title.localeCompare(b.title);
            });
            return sessionsToSort;
        }
        return sessions;
    }, [sessions, sessionsIsSuccess]);

    const handleCreateSession = async () => {
        try {
            const newSession: any = await createSession({
                title: "",
                description: "",
                course_id: props.id,
            });
            navigate(`/session/${newSession.data.id}`);
        } catch (e) {
            dispatch(pushNotification({
                message: "Something went wrong. The session has not been created",
                type: "error"
            }));
        }
    }


    //Create session button (teacher only)
    const CreateSessionButton = () => isOwner ? (
        <button
            id="create-session-button"
            className="flex items-center justify-center m-2 md:m-6 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 font-bold rounded-md shadow shadow-blue-50 transition duration-300 ease-in-out"
            onClick={handleCreateSession}
        >
            <PlusIcon className="w-5 h-5 mr-1" />
            Create Session
        </button>
    ) : (<></>)

    //Session list, or "no sessions" block if no sessions
    if (sessionsIsLoading) {
        return (
            <p>Loading sessions...</p>
        )
    }
    else if (sessionsIsSuccess && sessions.length === 0) {
        return (
            <ul className="border bg-gray-50 rounded-lg flex justify-center">
                <li id="no-sessions-warning" className="text-muted text-center border-dashed flex flex-col items-center">
                    <br />
                    <p>This course doesn't have any sessions yet.</p>
                    <CreateSessionButton />
                    <br />
                </li>
            </ul>
        )
    }
    else if (sessionsIsSuccess) {
        return (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2 md:mt-6">
                    {sortedSessions.map((session: any, i: number) => (
                        <Link
                            key={i}
                            className="border bg-gray-50 border-gray-300 rounded-md shadow p-4 flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:shadow-lg hover:scale-105"
                            to={"/session/" + session.id}
                        >
                            <p className={`text-xl line-clamp-3 font-medium ${session.title ? "text-gray-700" : "text-gray-500"}`}>
                                {session.title ? session.title : "Untitled Session"}
                            </p>
                            {session.has_started ? (<></>) : (
                                <p className="text-xs text-gray-500">
                                    Invisible to students
                                </p>
                            )}
                        </Link>
                    ))}
                </div >
                <div className="flex justify-center mt-1 md:mt-2">
                    <CreateSessionButton />
                </div>
            </>
        )
    }
    else if (sessionsIsError) {
        return (
            <p>Session not found</p>
        )
    }

    return null;
}

export default SessionContent;