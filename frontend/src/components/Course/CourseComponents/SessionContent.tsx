import { useSelector } from "react-redux";
import { useGetSessionsOfCourseQuery } from "../../../features/courses/sessionApiSlice";
import { selectCurrentUser, selectIsTeacher } from "../../../features/auth/authSlice";
import { useGetCourseQuery } from "../../../features/courses/courseApiSlice";
import { PlusIcon, LockOpenIcon ,ClockIcon } from '@heroicons/react/24/solid'

const SessionContent = (props: any) => {
    const username = useSelector(selectCurrentUser);
    const ownersUsernames = props.course?.owners.map((owner: any) => owner.username);
    const isTeacher = useSelector(selectIsTeacher);
    const isOwner = ownersUsernames?.includes(username);

    const {
        data: course,
        isLoading: courseIsLoading,
        isSuccess: courseIsSuccess,
        isError: courseIsError,
    } = useGetCourseQuery({ course_id: props.id });
    
    const {
        data: sessions,
        isLoading: sessionsIsLoading,
        isSuccess: sessionsIsSuccess,
        isError: sessionsIsError,
    } = useGetSessionsOfCourseQuery({ course_id: props.id })


    //Create session button (teacher only)
    const sessionListOwnerContent = () => {
        return isOwner ? (
            <a
            id="create-session"
            className="flex items-center justify-center m-2 md:m-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md shadow-lg transition duration-300 ease-in-out"
            href={"/session/create?course_id=" + props.id}
          >
                <PlusIcon className="w-5 h-5" />
                Create Session
          </a>
          
        ) : (<></>)
    }
    //Create session button, on "no sessions" block (teacher only)
    const sessionListOwnerContentNoSessions = () => {
        return isOwner ? (
            <a
            id="create-session-no-sessions"
            className="flex items-center justify-center m-2 md:m-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md shadow-lg transition duration-300 ease-in-out"
            href={"/session/create?course_id=" + props.id}
            >
                <PlusIcon className="w-6 h-6 mr-2" />
                <span>Create session</span>
            </a> 
        ) : (<></>)
    }

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
                    {sessionListOwnerContentNoSessions()}
                </li>
            </ul>
        )
    }
    else if (sessionsIsSuccess) {
        return (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  mt-2 md:mt-6">
                {sessions.map((session: any, i: number) => (
                <a
                key={i}
                className="border border-gray-300 rounded-md hover:shadow-lg p-4 flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
                href={"/session/" + session.id}
                >
                    <span className="text-gray-700 text-xl font-medium mb-2">{session.title}</span>
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
                </a>
        ))}
            </div>
            <div className="flex justify-center mt-1 md:mt-2">
                {sessionListOwnerContent()}
            </div>
            </>
    )
    }

    //Session not found or not authorized
    if (courseIsError || sessionsIsError) {
        return isTeacher ? (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The course you are looking for doesn't exist, <br />or you aren't allowed to access it.<br /><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        ) : (<></>)
    }
    
    return null;
}

export default SessionContent;