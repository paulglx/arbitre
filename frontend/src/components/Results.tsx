import { Accordion, Container, Table } from 'react-bootstrap'
import React, { useEffect } from 'react'

import Header from './Header'
import { selectIsTeacher } from '../features/auth/authSlice'
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

    const tableHeaderContent = (courses:any) => {

        const sessions_titles_and_width:any[] = []
        courses[0].students[0].sessions?.map((session:any) => ( sessions_titles_and_width.push({
           "session_title": session.session_title,
           "number_of_exercises": session.results.length
        })))

        return (<>
            <th key={-1} rowSpan={2}>Students</th>
            {sessions_titles_and_width.map((session:any, i:number) => (
                <th key={i} colSpan={session.number_of_exercises}>{session.session_title}</th>
            ))}
        </>)


    } 

    const courseResults = (course:any) => {

        console.log(course)

        return isSuccess ? (<>
            <Accordion.Header >{course.title}</Accordion.Header>
            <Accordion.Body>
                <Table striped bordered hover responsive className='p-0 m-0'>
                    <thead>
                        <tr>
                            {tableHeaderContent(courses)}
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th rowSpan={0}></th>
                            <th>Exercise 1</th>
                            <th>Exercise 2</th>
                            <th>Exercise 3</th>
                            <th>Exercise 1</th>
                            <th>Exercise 2</th>
                            <th>Exercise 3</th>
                        </tr>
                    </thead>
                    <tbody className='table-group-divider'>
                        <tr>
                            <td>Student 1</td>
                            <td>ok</td>
                            <td>ok</td>
                            <td>ok</td>
                            <td>ok</td>
                            <td>ok</td>
                            <td>ok</td>
                        </tr>
                        <tr>
                            <td>Student 2</td>
                            <td>ok</td>
                            <td>ok</td>
                            <td>ok</td>
                            <td>ok</td>
                            <td>ok</td>
                            <td>ok</td>
                        </tr>
                    </tbody>
                </Table>
            </Accordion.Body>
        </>) : (<></>)
    }

    return isTeacher && isSuccess ? (<>
        <Header />

        <br />

        <Container>

            <h1 className='h2 fw-bold'>Results</h1>

            <br />

            <Accordion defaultActiveKey="0" className='bg-light'>
                {results.courses?.map((course:any, i:number) => (
                    <Accordion.Item key={course.id} eventKey={String(i)}>
                        {courseResults(course)}
                    </Accordion.Item>
                ))}
            </Accordion>

        </Container>
    </>) : (<></>)
}

export default Results