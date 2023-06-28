import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from 'react'

import React from 'react'

const SessionDropdown = (props: any) => {

    const {
        courses,
        currentSession,
        setCurrentSession,
    } = props

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [sessionSearch, setSessionSearch] = useState('')
    const [currentSessionTitle, setCurrentSessionTitle] = useState('')
    const [sessionSearchResults, setSessionSearchResults] = useState<any>([])
    const dropdownButtonRef = React.createRef<HTMLButtonElement>()
    const dropdownMenuRef = React.createRef<HTMLDivElement>()

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

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
    }, [courses, setCurrentSession, setCurrentSessionTitle])

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

    return (<>
        <button
            className='text-2xl font-bold px-4 py-2 border-2 border-gray-300 bg-gray-100 rounded-md'
            id="sessions-dropdown-search-button"
            key={currentSession}
            type="button"
            aria-haspopup="true"
            aria-expanded="true"
            onClick={toggleDropdown}
            ref={dropdownButtonRef}
        >
            {currentSessionTitle ? currentSessionTitle : "Select a session"}
            {dropdownOpen ?
                <ChevronUpIcon className="inline-block h-6 w-6 ml-1 mb-1" />
                :
                <ChevronDownIcon className="inline-block h-6 w-6 ml-1 mb-1" />
            }
        </button>


        <div
            id="sessions-dropdown-menu"
            className={"fixed z-10 w-96 mt-2 bg-white border-4 border-gray-300 rounded-md shadow-md " + (dropdownOpen ? "visible" : "hidden")}
            aria-labelledby="sessions-dropdown-search-button"
            ref={dropdownMenuRef}
        >
            <div className="p-3">
                <label htmlFor="input-group-search" className="sr-only">
                    Search
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        autoFocus
                        id="input-group-search"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search session"
                        type="search"
                        onChange={(e) => setSessionSearch(e.target.value)}
                        value={sessionSearch}
                    />
                </div>
            </div>

            <ul className='h-48 px-3 overflow-y-auto text-sm text-gray-700'>
                {
                    sessionSearchResults?.map((course: any) => (
                        <div key={course.course.id}>
                            <li key={course.course.id} className="my-2">
                                <span
                                    key={course.course.id}
                                    className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 font-bold cursor-default"
                                >
                                    {course.course.title}
                                </span>
                            </li>
                            {course.sessions.length > 0 ? course.sessions.map((session: any) => (<div key={session.id}>
                                <li
                                    key={session.id}
                                    onClick={() => {
                                        setCurrentSession(session.id)
                                        setCurrentSessionTitle(session.title)
                                    }}
                                    className='my-4'
                                >
                                    <span
                                        className={"px-4 py-2 text-sm rounded-md " + (session.id === currentSession ? "cursor-default font-bold bg-gray-700 text-gray-100 " : "cursor-pointer hover:bg-gray-200")}
                                        key={session.id}
                                    >
                                        {session.title}
                                    </span>
                                </li>
                            </div>))
                                :
                                <li className="my-4">
                                    <span
                                        className="px-4 py-2 rounded-md text-gray-500 cursor-default italic"
                                        key={course.course.id + "-no-sessions"}
                                    >
                                        No sessions
                                    </span>
                                </li>
                            }
                        </div>))
                }
            </ul>
        </div >
    </>)
}

export default SessionDropdown