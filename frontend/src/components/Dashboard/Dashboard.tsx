import DashboardResultsTable from './DashboardResultsTable'
import DashboardSessionPicker from './DashboardSessionPicker'
import Header from '../Common/Header'
import React from 'react'
import { useGetCoursesSessionsExercisesQuery } from '../../features/courses/courseApiSlice'
import { useState } from 'react'

const Dashboard = () => {

    const [currentSession, setCurrentSession] = useState(-1)
    const [currentSessionTitle, setCurrentSessionTitle] = useState('')

    const {
        data: courses,
        isSuccess: isCoursesSuccess,
    } = useGetCoursesSessionsExercisesQuery({});

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

        } else {
            return <>
                <DashboardSessionPicker
                    courses={courses}
                    currentSession={currentSession}
                    setCurrentSession={setCurrentSession}
                    currentSessionTitle={currentSessionTitle}
                    setCurrentSessionTitle={setCurrentSessionTitle}
                />
                <br />
                {currentSession !== -1 ?
                    <DashboardResultsTable session_id={currentSession} />
                    :
                    <></>
                }
            </>
        }
    }

    return <>

        <Header />

        <br />
        <br />

        <div className="container mx-auto">

            <PageContent />

        </div>
    </>
}

export default Dashboard