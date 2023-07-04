import { Link } from "react-router-dom";
import { PlusIcon } from '@heroicons/react/24/solid'
// import { ClockIcon } from '@heroicons/react/24/solid'
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { useGetSessionsOfCourseQuery } from "../../../features/courses/sessionApiSlice";
import { useSelector } from "react-redux";

const SessionContent = (props: any) => {
    const username = useSelector(selectCurrentUser);
    const ownersUsernames = props.course?.owners.map((owner: any) => owner.username);
    const isOwner = ownersUsernames?.includes(username);

    const {
        data: sessions,
        isLoading: sessionsIsLoading,
        isSuccess: sessionsIsSuccess,
        isError: sessionsIsError,
    } = useGetSessionsOfCourseQuery({ course_id: props.id })


    //Create session button (teacher only)
    const CreateSessionButton = () => isOwner ? (
        <Link
            id="create-session-button"
            className="flex items-center justify-center m-2 md:m-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md shadow-lg transition duration-300 ease-in-out"
            to={"/session/create?course_id=" + props.id}
        >
            <PlusIcon className="w-5 h-5 mr-1" />
            Create Session
        </Link>

    ) : (<></>)

    //Create session button, on "no sessions" block (teacher only)
    const CreateSessionButtonNoSessions = () => isOwner ? (
        <Link
            id="create-session-no-sessions"
            className="flex items-center justify-center m-2 md:m-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md shadow-lg transition duration-300 ease-in-out"
            to={"/session/create?course_id=" + props.id}
        >
            <PlusIcon className="w-6 h-6 mr-2" />
            Create Session
        </Link>
    ) : (<></>)

    //Session list, or "no sessions" block if no sessions
    if (sessionsIsLoading) {
        return (
            <p>Loading sessions...</p>
        )
    }
    else if (sessionsIsSuccess && sessions.length === 0) {
        return (
            <ul className="border border-gray-300 rounded-md flex justify-center">
                <li id="no-sessions-warning" className="text-muted text-center border-dashed flex flex-col items-center">
                    <br />
                    <p>This course doesn't have any sessions.</p>
                    <CreateSessionButtonNoSessions />
                </li>
            </ul>
        )
    }
    else if (sessionsIsSuccess) {
        return (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  mt-2 md:mt-6">
                    {sessions.map((session: any, i: number) => (
                        <Link
                            key={i}
                            className="border bg-gray-50 border-gray-300 rounded-md shadow p-4 flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:shadow-lg hover:scale-105"
                            to={"/session/" + session.id}
                        >
                            <span className="text-gray-700 text-xl font-medium">{session.title}</span>
                            {/*
                            <div className="flex items-center">
                                <ClockIcon className="w-6 h-6 mr-1 text-gray-500" />


                                <span className="text-gray-500 text-sm">{session.duration}</span>
                                {session.openingTime && (
                                    <div className="flex items-center ml-2">
                                        <LockOpenIcon className="w-5 h-5 mr-1 text-gray-500" />
                                        <span className="text-gray-500 text-sm">{session.openingTime}</span>
                                    </div>
                                )}

                            </div>
                            */}
                        </Link>
                    ))}
                </div>
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