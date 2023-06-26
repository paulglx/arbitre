import 'flowbite'

import { Button, Container, ListGroup } from 'react-bootstrap'
import { ChevronDown, Search } from "heroicons-react"
import { useEffect, useState } from 'react'

import Header from '../Common/Header'
import React from 'react'
import ResultsTable from './ResultsTable'
import { useGetCoursesSessionsExercisesQuery } from '../../features/courses/courseApiSlice'

const Dashboard = () => {

    const [currentSession, setCurrentSession] = useState(-1)
    const [currentSessionTitle, setCurrentSessionTitle] = useState('')
    const [sessionSearch, setSessionSearch] = useState('')
    const [sessionSearchResults, setSessionSearchResults] = useState<any>([])

    const {
        data: courses,
        isSuccess: isCoursesSuccess,
    } = useGetCoursesSessionsExercisesQuery({});

    // Set current session at first render
    useEffect(() => {
        if (courses) {
            if (courses?.every((course: any) => course.sessions.length === 0)) {
                setCurrentSession(-1)
                setCurrentSessionTitle('')
            } else {
                const firstCourseWithExercises = courses.find((course: any) => course.sessions.length > 0 && course.sessions[0]?.exercises?.length > 0)
                setCurrentSession(firstCourseWithExercises.sessions[0].id)
                setCurrentSessionTitle(firstCourseWithExercises.sessions[0].title)
            }
        }
    }, [courses])

    useEffect(() => {
        if (courses) {
            if (sessionSearch) {
                const results = courses?.map((course: any) => {
                    return {
                        course: course,
                        sessions: course.sessions.filter((session: any) => session.title.toLowerCase().includes(sessionSearch.toLowerCase()))
                    }
                })
                setSessionSearchResults(results)
            } else {
                const results = courses?.map((course: any) => {
                    return {
                        course: course,
                        sessions: course.sessions
                    }
                })
                setSessionSearchResults(results)
            }
        }
    }, [sessionSearch, courses])

    // TODO make it open and close - https://flowbite.com/docs/components/dropdowns/#dropdown-with-search

    const sessionDropdown = () => {
        return (<>
            <button
                className='text-2xl font-bold px-4 py-2 border-4 border-gray-300 bg-gray-100 rounded-md'
                data-dropdown-placement="bottom-start"
                data-dropdown-toggle="sessions-dropdown-menu"
                id="sessions-dropdown-search-button"
                key={currentSession}
                type="button"
            >
                {currentSessionTitle ? currentSessionTitle : "Select a session"}
                <ChevronDown className="inline-block ml-2" />
            </button>


            <div
                id="sessions-dropdown-menu"
                className="z-10 w-96 visible mt-2 bg-white border-4 border-gray-300 rounded-md shadow-md"
            >
                <div className="p-3">
                    <label htmlFor="input-group-search" className="sr-only">
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            autoFocus
                            id="input-group-search"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Type to filter"
                            type="search"
                            onChange={(e) => setSessionSearch(e.target.value)}
                            value={sessionSearch}
                        />
                    </div>
                </div>

                <ul className='h-48 px-3 overflow-y-auto text-sm text-gray-700'>
                    {
                        sessionSearchResults?.map((course: any) => (<>
                            {course.sessions.length > 0 ?
                                <li key={course.course.id} className="my-2">
                                    <span
                                        className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 font-bold cursor-default"
                                    >
                                        {course.course.title}
                                    </span>
                                </li>
                                : null
                            }
                            {course.sessions.map((session: any) => (<>
                                <li
                                    key={session.id}
                                    onClick={() => {
                                        setCurrentSession(session.id)
                                        setCurrentSessionTitle(session.title)
                                    }}
                                    className='my-4'
                                >
                                    <span className={"px-4 py-2 text-sm rounded-md " + (session.id === currentSession ? "cursor-default font-bold bg-gray-700 text-gray-100 " : "cursor-pointer hover:bg-gray-200")}>
                                        {session.title}
                                    </span>
                                </li>
                            </>))}
                        </>))
                    }
                </ul >

            </div>

        </>)
    }

    if (courses?.length === 0) {
        return <>
            <Header />

            <br />
            <br />

            <div className="container mx-auto">
                <ListGroup>
                    <ListGroup.Item className='p-3 dashed-border rounded-4 text-center text-muted'>
                        <span className='fw-bold'>No courses</span> <br />
                        You don't have a course to display the results of yet.<br />
                        <Button className='border mt-2' variant='light' href="/course">← Back to courses</Button>
                    </ListGroup.Item>
                </ListGroup>
            </div>
        </>
    }

    if (courses?.every((course: any) => course.sessions.length === 0)) {
        return <>

            <Header />

            <br />
            <br />

            <Container>
                <ListGroup>
                    <ListGroup.Item className='p-3 dashed-border rounded-4 text-center text-muted'>
                        <span className='fw-bold'>No sessions</span> <br />
                        You don't have a session to display the results of yet.<br />
                        <Button className='border mt-2' variant='light' href="/course">← Back to courses</Button>
                    </ListGroup.Item>
                </ListGroup>
            </Container>
        </>
    }

    return isCoursesSuccess ? (<>

        <Header />

        <br />
        <br />

        <div className="container mx-auto">

            {sessionDropdown()}

            <br />

            {currentSession !== -1 ?
                <ResultsTable session_id={currentSession} />
                :
                <></>
            }

        </div>
    </>) : (<></>)
}

export default Dashboard