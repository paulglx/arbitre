import GradingSession from "./GradingSession"
import { useGetSessionsOfCourseQuery } from "../../../features/courses/sessionApiSlice";
import { useMemo } from "react";

const Grading = (props: any) => {
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
    return (
        <>
            {sortedSessions ? sortedSessions.map((session: any) => (
                <div key={session.id}>
                    <GradingSession session={session} />
                </div>
            )) : null}
        </>
    )
}

export default Grading