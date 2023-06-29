import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from 'react'

import React from 'react'

const DashboardSessionPicker = (props: any) => {

    const {
        courses,
        currentSession,
        setCurrentSession,
        currentSessionTitle,
        setCurrentSessionTitle
    } = props
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [sessionSearch, setSessionSearch] = useState('')
    const [sessionSearchResults, setSessionSearchResults] = useState<any>([])
    const dropdownButtonRef = React.createRef<HTMLButtonElement>()
    const dropdownMenuRef = React.createRef<HTMLDivElement>()

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    // Set current session at first render
    useEffect(() => {
        if (courses && currentSession === -1) {
            if (courses?.every((course: any) => course.sessions.length === 0)) {
                setCurrentSession(-1)
                setCurrentSessionTitle('')
            } else {
                const firstCourseWithExercises = courses.find((course: any) => course.sessions.length > 0 && course.sessions[0]?.exercises?.length > 0)
                setCurrentSession(firstCourseWithExercises.sessions[0].id)
                setCurrentSessionTitle(firstCourseWithExercises.sessions[0].title)
            }
        }
    }, [courses, currentSession, setCurrentSession, setCurrentSessionTitle])

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
            id="sessions-dropdown-search-button"
            aria-expanded="true"
            aria-haspopup="true"
            className='text-3xl font-bold px-4 py-2 border-2 border-gray-300 bg-gray-100 rounded-md'
            key={currentSession}
            onClick={toggleDropdown}
            ref={dropdownButtonRef}
            type="button"
        >
            {currentSessionTitle ? currentSessionTitle : "Select a session"}
            {dropdownOpen ?
                <ChevronUpIcon id="chevron-up-icon" className="inline-block h-8 w-8 ml-2" />
                :
                <ChevronDownIcon id="chevron-down-icon" className="inline-block h-8 w-8 ml-2" />
            }
        </button>


        <div
            id="sessions-dropdown-menu"
            aria-labelledby="sessions-dropdown-search-button"
            className={"fixed z-10 w-96 mt-2 bg-white border-4 border-gray-300 rounded-md shadow-md " + (dropdownOpen ? "visible" : "hidden")}
            ref={dropdownMenuRef}
        >
            <div id="dropdown" className="p-3">
                <label htmlFor="input-group-search" className="sr-only">
                    Search
                </label>
                <div id="dropdown-content" className="relative">
                    <div id="search-icon-wrapper" className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon id="search-icon" className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        aria-label="Search sessions"
                        autoComplete="off"
                        autoFocus
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        id="input-group-search"
                        onChange={(e) => setSessionSearch(e.target.value)}
                        placeholder="Search session"
                        type="search"
                        value={sessionSearch}
                    />
                </div>
            </div>

            <ul id="results-list" className='h-48 px-3 overflow-y-auto text-sm text-gray-700'>
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

export default DashboardSessionPicker