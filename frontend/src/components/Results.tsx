import { Accordion, Badge, Container, Spinner, Table } from 'react-bootstrap'
import React, { useEffect } from 'react'

import Header from './Header'
import { selectIsTeacher } from '../features/auth/authSlice'
import session from 'redux-persist/lib/storage/session'
import { useGetAllResultsQuery } from '../features/results/resultsApiSlice'
import { useSelector } from 'react-redux'

const Results = () => {

    const isTeacher = useSelector(selectIsTeacher)

    const {
        data: results,
        isSuccess,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetAllResultsQuery({})

    const courses = results?.courses

    console.log("Courses:",courses)

    const statusContent = (status:string) => {
        if (status === "not submitted") {
            return <span className='text-muted'>-</span>
        } else if (status === "running") {
         return (
            <Spinner animation="border" role="status" as="span" size="sm">
                <span className="visually-hidden">Running...</span>
            </Spinner>)
        } else if (status === "PENDING" || status === "pending") {
         return (
            <Spinner animation="border" role="status" as="span" size="sm">
                <span className="visually-hidden">Pending...</span>
            </Spinner>)
        } else if (status === "success") {
            return <Badge bg="success">Success</Badge>
        } else if (status === "failed") {
            return <Badge bg="secondary">Failed</Badge>
        } else if (status === "error") {
            return <Badge bg="danger">Error</Badge>
        }
    }

    const tableHeadContent = (session:any) => {
        return (
            <thead>
                <tr>
                    <th>Student</th>
                    {session.students_data[0]?.results?.map((exercise:any) => (
                        <th className='fw-normal'>{exercise.exercise_title}</th>
                    ))}
                </tr>
            </thead>
        )
    }

    const tableBodyContent = (session:any) => {
        return (<>
            <tbody className=''>
                {session.students_data.map((student:any) => (
                    <tr>
                        <td className=''>{student.student_name}</td>
                        {student.results?.map((exercise:any) => (
                            <td className='text-center'>{statusContent(exercise.status)}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </>)
    }

    const courseResultsTable = (course:any) => {

        console.log(course)

        return isSuccess ? (
            course.sessions.map((session:any, i:number) => (<>
                <Accordion.Item eventKey={String(i)}>
                    <Accordion.Header>{session.session_title}</Accordion.Header>
                    <Accordion.Body>
                        
                        <Table striped bordered hover className='p-0 m-0'>
                            {tableHeadContent(session)}
                            {tableBodyContent(session)}
                        </Table>

                    </Accordion.Body>
                </Accordion.Item>
            </>))) : (<></>)
    }

    return isTeacher && isSuccess ? (<>
        <Header />

        <br />

        <Container>

            <h1 className='h2 fw-bold'>Results</h1>

            <br />

            {courses.map((course:any, i:number) => (<>

                <h2>{course.course_title}</h2>

                <Accordion key={course.course_id} defaultActiveKey="0">
                    {courseResultsTable(course)}
                </Accordion>

                <br />
                
            </>))}

        </Container>
    </>) : (<></>)
}

export default Results