import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from 'react'

import { Link } from "react-router-dom"
import React from 'react'
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

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
  const navigate = useNavigate()

  const urlSession = useParams()?.session

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target) && dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownButtonRef, dropdownMenuRef])

  // Set current session at first render
  useEffect(() => {

    // If session in URL
    if (courses && urlSession) {
      const session = courses?.find((course: any) => course.sessions.some((session: any) => session.id === parseInt(urlSession)))?.sessions?.find((session: any) => session.id === parseInt(urlSession))
      if (session) {
        setCurrentSession(session.id)
        setCurrentSessionTitle(session.title)
        return
      } else {
        // Incorrect session id
        setCurrentSession(-1)
        setCurrentSessionTitle('')
        navigate(`./../`, { replace: true })
        return
      }
    }

    // If coming from "Dashboard button"
    if (courses && currentSession === -1) {

      // Check for session storage
      const lastVisitedSession = Number(window.sessionStorage.getItem("last_visited_session"));
      if (lastVisitedSession) {
        const session = courses?.map((course: any) => course.sessions)
          .flat()
          .find((session: { id: number, title: string }) => session?.id === lastVisitedSession)

        if (session) {
          setCurrentSession(session?.id)
          setCurrentSessionTitle(session?.title)
          navigate(`./${session.id}`, { replace: true })
          return
        }
      }

      if (courses?.every((course: any) => course.sessions.length === 0)) {
        setCurrentSession(-1)
        setCurrentSessionTitle('')
      } else {
        const session = courses?.find((course: any) => course.sessions.length > 0)?.sessions[0]
        setCurrentSession(session.id)
        setCurrentSessionTitle(session.title)
        navigate(`./${session.id}`, { replace: true })
      }
    }
  }, [courses, currentSession, setCurrentSession, setCurrentSessionTitle, urlSession, navigate])

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

  const GoToSessionButton = () => {
    return (
      <Link
        aria-label="Go to session"
        className="pl-1 pt-1 text-sm text-gray-600 hover:text-gray-700 hover:underline"
        to={`/session/${currentSession}`}
      >
        → Go to session
      </Link>
    )
  }

  return (<div className="flex flex-col">
    <div id="relative inline-block">
      <button
        aria-expanded="true"
        aria-haspopup="true"
        aria-label="Select session"
        className='text-3xl font-bold px-4 py-2 border-2 border-blue-300 bg-blue-50 rounded-md text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        id="sessions-dropdown-search-button"
        key={currentSession}
        onClick={toggleDropdown}
        ref={dropdownButtonRef}
        type="button"
      >
        {currentSession !== -1 ?
          currentSessionTitle ? currentSessionTitle : "Untitled session"
          :
          "Select a session"}
        {dropdownOpen ?
          <ChevronUpIcon id="chevron-up-icon" className="inline-block h-8 w-8 ml-2" />
          :
          <ChevronDownIcon id="chevron-down-icon" className="inline-block h-8 w-8 ml-2" />
        }
      </button>

      <div
        id="sessions-dropdown-menu"
        aria-labelledby="sessions-dropdown-search-button"
        className={"absolute origin-center z-10 mt-2 bg-white border-2 border-gray-300 rounded-md shadow-md " + (dropdownOpen ? "visible" : "hidden")}
        ref={dropdownMenuRef}
      >
        <div id="dropdown-wrapper" className="p-3">
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
            sessionSearchResults?.sort(
              (a: any, b: any) => a.course.title < b.course.title ? -1 : 1
            ).map((course: any) => (
              <div key={course.course.id}>
                <li key={course.course.id} className="my-2">
                  <span
                    key={course.course.id}
                    className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 font-bold cursor-default"
                  >
                    {course.course.title ? course.course.title : "Untitled course"}
                  </span>
                </li>
                {course.sessions.length > 0 ?
                  structuredClone(course.sessions).sort(
                    (a: any, b: any) => a.title < b.title ? -1 : 1
                  ).map((session: any) => (
                    <div key={session.id}>
                      <li
                        key={session.id}
                        onClick={() => {
                          setCurrentSession(session.id)
                          setCurrentSessionTitle(session.title)
                          setDropdownOpen(false)
                          navigate(`./../${session.id}`, { replace: true })
                        }}
                        className='my-4'
                      >
                        <span
                          className={"px-4 py-2 text-sm rounded-md " + (session.id === currentSession ? "cursor-default font-bold bg-blue-700 text-gray-100 " : "cursor-pointer hover:bg-gray-200")}
                          key={session.id}
                        >
                          {session.title ? session.title : "Untitled session"}
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
    </div>

    <GoToSessionButton />

  </div>)
}

export default DashboardSessionPicker
