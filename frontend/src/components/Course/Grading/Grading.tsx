import { useMemo, useState } from "react";

import GradingSession from "./GradingSession";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import NeedHelp from "./NeedHelp";
import { useGetSessionsOfCourseQuery } from "../../../features/courses/sessionApiSlice";

const Grading = (props: any) => {
    const [showHelp, setShowHelp] = useState(false);

    const {
        data: sessions,
        isSuccess: sessionsIsSuccess,
    } = useGetSessionsOfCourseQuery({ course_id: props.courseId })

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

    return (
        <>
            <div className="flex justify-end my-4">
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
        </>
    )
}

export default Grading;
