import { useEffect, useState } from 'react'

import DashboardGroupsPicker from './DashboardGroupsPicker'
import DashboardResultsTable from './DashboardResultsTable'
import DashboardSessionPicker from './DashboardSessionPicker'
import Header from '../Common/Header'
import NotFound from '../Common/NotFound'
import { selectIsTeacher } from '../../features/auth/authSlice'
import { useGetCoursesSessionsExercisesQuery } from '../../features/courses/courseApiSlice'
import { useSelector } from 'react-redux'
import { useTitle } from '../../hooks/useTitle'

const Dashboard = () => {

    const [currentSession, setCurrentSession] = useState(-1)
    const [currentSessionTitle, setCurrentSessionTitle] = useState('')
    const [selectedGroups, setSelectedGroups] = useState([] as number[])
    const isTeacher = useSelector(selectIsTeacher)

    const {
        data: courses,
        isSuccess: isCoursesSuccess,
    } = useGetCoursesSessionsExercisesQuery({});

    useTitle("Dashboard")

    useEffect(() => {
        setSelectedGroups([])
    }, [currentSession])

    const PageContent = () => {
        if (!isCoursesSuccess) {
            return <span id="loading-text">Loading...</span>
        } else if (courses?.length === 0) {
            return <>
                <span id="error-title" className='font-bold'>No courses</span> <br />
                <span id="error-message">You don't have a course to display the results of yet.</span>
                <br />
                <a id="back-link" className='mt-2 text-blue-700' href="/course">← Back to courses</a>
            </>
        } else if (courses?.every((course: any) => course.sessions.length === 0)) {
            return <>
                <span id="error-title" className='font-bold'>No sessions</span> <br />
                <span id="error-message">You don't have a session to display the results of yet.</span>
                <br />
                <a id="back-link" className='mt-2 text-blue-700' href="/course">← Back to courses</a>
            </>
        } else if (courses?.every((course: any) => course.sessions.every((session: any) => session.exercises.length === 0))) {
            return <>
                <span id="error-title" className='font-bold'>No exercises</span> <br />
                <span id="error-message">You don't have an exercise to display the results of yet.</span>
                <br />
                <a id="back-link" className='mt-2 text-blue-700' href="/course">← Back to courses</a>
            </>
        } else {
            return <>
                <div className="flex justify-between items-center">
                    <DashboardSessionPicker
                        courses={courses}
                        currentSession={currentSession}
                        setCurrentSession={setCurrentSession}
                        currentSessionTitle={currentSessionTitle}
                        setCurrentSessionTitle={setCurrentSessionTitle}
                    />
                    <DashboardGroupsPicker
                        course={courses?.find((course: any) => course.sessions.some((session: any) => session.id === currentSession))}
                        selectedGroups={selectedGroups}
                        setSelectedGroups={setSelectedGroups}
                    />
                </div>
                <br />
                {currentSession !== -1 ?
                    <DashboardResultsTable sessionId={currentSession} selectedGroups={selectedGroups} />
                    :
                    <></>
                }
            </>
        }
    }

    return isTeacher ? (<>

        <Header />

        <br />
        <br />

        <div className="container mx-auto">

            <PageContent />

        </div>
    </>) : (
        <NotFound />
    )
}

export default Dashboard