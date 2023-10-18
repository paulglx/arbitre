import { useMemo, useState } from "react";

import GradingSession from "./GradingSession";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import NeedHelp from "./NeedHelp";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { useGetSessionsOfCourseQuery } from "../../../features/courses/sessionApiSlice";
import { useSelector } from "react-redux";

const Grading = (props: any) => {

    const course = props.course

    const username = useSelector(selectCurrentUser);

    const tutorsUsernames = course?.tutors?.map((tutor: any) => tutor.username);
    const isTutor = tutorsUsernames?.includes(username);

    const [showHelp, setShowHelp] = useState(false);

    const {
        data: sessions,
        isSuccess: sessionsIsSuccess,
        isLoading: sessionsIsLoading,
    } = useGetSessionsOfCourseQuery({ course_id: course?.id })

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

    const toggleHelp = () => {
        setShowHelp(!showHelp);
    };

    if (sessionsIsLoading) {
        return null;
    }

    return (<>
        {isTutor ? (
            <div className="bg-blue-50 border border-blue-100 text-blue-600 py-1 px-2 rounded-lg text-sm flex items-center mt-4">
                <InformationCircleIcon className="w-4 h-4 mr-1 inline" />
                You are a tutor. Only owners can edit the grading grid.
            </div>
        ) : null}
        <div className={isTutor ? " pointer-events-none opacity-50 select-none" : ""}>

            <div className={"flex justify-end my-4"}>
                <button
                    className="text-sm bg-blue-500 text-white py-2 rounded-md flex items-center justify-center w-40"
                    onClick={toggleHelp}
                >
                    <InformationCircleIcon className="w-4 h-4 mr-2" />
                    <span className="mr-1">Need help?</span>
                </button>
            </div>
            {showHelp && <NeedHelp />}
            {sortedSessions ? sortedSessions.map((session: any) => (
                <div key={session.id}>
                    <GradingSession session={session} />
                </div>
            )) : null}
        </div>
    </>)
}

export default Grading;
