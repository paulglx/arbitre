import { Container, Dropdown, Form } from 'react-bootstrap'
import { useEffect, useState } from 'react'

import { CaretDownFill } from 'react-bootstrap-icons'
import Header from './Header'
import React from 'react'
import ResultsTable from './ResultsTable'
import { useGetCoursesSessionsExercisesQuery } from '../features/courses/courseApiSlice'

const Results = () => {

    const [currentSession, setCurrentSession] = useState(-1)
    const [currentSessionTitle, setCurrentSessionTitle] = useState('')
    const [sessionSearch, setSessionSearch] = useState('')
    const [sessionSearchResults, setSessionSearchResults] = useState<any>([])

    const {
        data: courses,
        isSuccess: isCoursesSuccess,
        isError: isCoursesError,
        error: coursesError,
    } = useGetCoursesSessionsExercisesQuery({});

    useEffect(() => {
        if (courses) {
            setCurrentSession(courses[0].sessions[0].id)
            setCurrentSessionTitle(courses[0].sessions[0].title)
        }
    }, [courses])

    useEffect(() => {
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
    }, [sessionSearch, courses])

    const CustomToggle = React.forwardRef(({ children, onClick }: any, ref) => (
        <a
            className='h2 text-dark px-2 py-1 text-decoration-none shadow-sm border rounded-4'
            href="#dropdown"
            ref={ref as any}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children} <CaretDownFill />
        </a>
    ));

    const CustomMenu = React.forwardRef(
        ({ children, className, 'aria-labelledby': labeledBy }: any, ref) => {

            return (
                <div
                    ref={ref as any}
                    className={className}
                    aria-labelledby={labeledBy}
                >
                    <Form.Control
                        autoFocus
                        className="rounded-3 mx-2 w-75"
                        placeholder="Type to filter"
                        onChange={(e) => setSessionSearch(e.target.value)}
                        value={sessionSearch}
                    />
                    <ul className="list-unstyled">
                        {
                            sessionSearchResults?.map((course: any) => (<>
                                <Dropdown.Divider />
                                {course.sessions.length > 0 ?
                                    <Dropdown.Header key={course.course.id} className="text-wrap">{course.course.title}</Dropdown.Header>
                                    : null
                                }
                                {course.sessions.map((session: any) => (<>
                                    <Dropdown.Item
                                        key={session.id}
                                        eventKey={session.id}
                                        className={"text-wrap" + (session.id === currentSession ? " bg-primary text-white" : "")}
                                        onClick={(eventKey: any) => {
                                            setCurrentSession(session.id)
                                            setCurrentSessionTitle(session.title)
                                        }}
                                    >
                                        {session.title}
                                    </Dropdown.Item>
                                </>))}
                            </>))
                        }
                    </ul>
                </div>
            );
        },
    );

    return isCoursesSuccess ? (<>
        <Header />

        <br />
        <br />

        <Container>

            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    {currentSessionTitle}
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu} className="border rounded-4 mt-3 shadow-sm w-50">

                </Dropdown.Menu>
            </Dropdown>

            <br />

            {currentSession !== -1 ?
                <ResultsTable session_id={currentSession} />
                :
                <></>
            }

        </Container>
    </>) : (<></>)
}

export default Results