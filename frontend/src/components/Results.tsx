import { Accordion, Badge, Container, Modal, Spinner, Table } from 'react-bootstrap'

import Error from './Error'
import Header from './Header'
import TestResult from './TestResult'
import { selectIsTeacher } from '../features/auth/authSlice'
import { useGetAllResultsQuery } from '../features/results/resultsApiSlice'
import { useSelector } from 'react-redux'
import { useState } from 'react'

const Results = () => {

    const isTeacher = useSelector(selectIsTeacher)

    const [showModal, setShowModal] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalContent, setModalContent] = useState(<></>)

    const handleModalClose = () => setShowModal(false)
    const handleModalShow = () => setShowModal(true)

    const {
        data: results,
        isSuccess,
        isError,
        error,
    } = useGetAllResultsQuery({})

    const courses = results?.courses

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
            return <Badge bg="secondary">Fail</Badge>
        } else if (status === "error") {
            return <Badge bg="danger">Error</Badge>
        }
    }

    const tableHeadContent = (session:any) => {
        return session.students_data[0]?.results.length > 0 ? (
            <thead>
                <tr key={-1}>
                    <th key={-1}>Student</th>
                    {session.students_data[0]?.results?.map((exercise:any, i:number) => (
                        <th className='fw-normal' key={i}>{exercise.exercise_title}</th>
                    ))}
                </tr>
            </thead>
        ) : (<></>)
    }

    const tableBodyContent = (session:any) => {
        console.log(session)
        return session.students_data[0]?.results.length > 0 ? (<>
            <tbody className=''>
                {session.students_data.map((student:any, i:number) => (
                    <tr key={i}>
                        <td className=''>{student.student_name}</td>
                        {student.results?.map((exercise:any, j:number) => (
                            <td
                                className='text-center cursor-pointer'
                                role={exercise.status !== "not submitted" ? "button" : ""}
                                key={j}
                                onClick = {exercise.status !== "not submitted" ? (() => {
                                        setModalTitle(`${student.student_name}'s submission for ${exercise.exercise_title}`)
                                        setModalContent(<TestResult exercise_id={exercise.exercise_id} user_id={student.student_id} />)
                                        handleModalShow()
                                    }) : (
                                        undefined
                                    )
                                }
                            >
                                {statusContent(exercise.status)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </>) : (
            <tbody>
                <tr>
                    <td colSpan={session.students_data[0]?.results?.length + 1} className='text-center text-muted'>There are no students registered to this course</td>
                </tr>
            </tbody>
        )
    }

    const courseResultsTable = (course:any) => {

        console.log(course)

        return isSuccess ? (
            course.sessions.map((session:any, i:number) => (<>
                <Accordion.Item eventKey={String(i)} key={i}>
                    <Accordion.Header>{session.session_title}</Accordion.Header>
                    <Accordion.Body className='overflow-scroll p-0 m-0'>
                        
                        <Table striped bordered hover className='p-0 m-0'>
                            {tableHeadContent(session)}
                            {tableBodyContent(session)}
                        </Table>

                    </Accordion.Body>
                </Accordion.Item>
            </>))) : (<></>)
    }

    return isTeacher && isSuccess ? (<>

        <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title className='h6'>
                    {modalTitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {modalContent}
            </Modal.Body>
        </Modal>

        <Header />

        <br />

        <Container>

            <h1 className='h2 fw-bold'>Results</h1>

            <br />

            {courses.map((course:any, i:number) => (<>

                <h2>{course.course_title}</h2>

                <Accordion key={course.course_id}>
                    {courseResultsTable(course)}
                </Accordion>

                <br />
                
            </>))}

        </Container>
    </>) : (<Error isError={isError} error={JSON.stringify(error)} />)
}

export default Results