import { Badge, Container, Modal, Spinner, Table } from "react-bootstrap";

import TestResult from "./TestResult";
import { useGetResultsOfSessionQuery } from "../features/results/resultsApiSlice";
import { useState } from "react";

const ResultsTable = (props: any) => {

    const [modalContent, setModalContent] = useState(<></>)
    const [modalTitle, setModalTitle] = useState("")
    const [showModal, setShowModal] = useState(false)
    const handleModalClose = () => setShowModal(false)
    const handleModalShow = () => setShowModal(true)
    const session_id = props.session_id;

    const {
        data: results,
        isSuccess: isResultsSuccess,
        isError: isResultsError,
        error: resultsError,
    } = useGetResultsOfSessionQuery({ session_id });

    const statusContent = (status: string) => {
        if (status === "not submitted") {
            return <span className="text-muted">-</span>;
        } else if (status === "running") {
            return (
                <Spinner animation="border" role="status" as="span" size="sm">
                    <span className="visually-hidden">Running...</span>
                </Spinner>
            );
        } else if (status === "PENDING" || status === "pending") {
            return (
                <Spinner animation="border" role="status" as="span" size="sm">
                    <span className="visually-hidden">Pending...</span>
                </Spinner>
            );
        } else if (status === "success") {
            return <Badge bg="success">Success</Badge>;
        } else if (status === "failed") {
            return <Badge bg="secondary">Fail</Badge>;
        } else if (status === "error") {
            return <Badge bg="danger">Error</Badge>;
        }
    };

    const tableHeadContent = (results: any) => {
        return results[0]?.exercises.length > 0 ? (
            <thead>
                <tr key={-1} className="bg-light">
                    <th key={-1}>Student</th>
                    {results[0]?.exercises?.map(
                        (exercise: any, i: number) => (
                            <th className="fw-normal" key={i}>
                                {exercise.exercise_title}
                            </th>
                        )
                    )}
                </tr>
            </thead>
        ) : (
            <></>
        );
    };

    const tableBodyContent = (results: any) => {
        return results[0]?.exercises.length > 0 ? (
            <tbody>
                {results.map((student: any, i: number) => (
                    <tr key={i}>
                        <td key={-1}>{student.username}</td>
                        {student.exercises.map((exercise: any, j: number) => (
                            <td
                                className='text-center cursor-pointer'
                                role={exercise.status !== "not submitted" ? "button" : ""}
                                key={j}
                                onClick={exercise.status !== "not submitted" ? (() => {
                                    setModalTitle('Submission Result')
                                    setModalContent(<>
                                        <TestResult exercise_id={exercise.exercise_id} user_id={student.user_id} />
                                        <div className="bg-light border rounded mt-2 p-2">
                                            <p className='text-muted m-1'>
                                                <span className='fw-bold'>Exercise : </span>
                                                <a href={`/exercise/${exercise.exercise_id}`} >
                                                    {exercise.exercise_title}
                                                </a>
                                            </p>
                                            <p className='text-muted m-1'>
                                                <span className='fw-bold'>Submitted by : </span>
                                                {student.username}
                                            </p>
                                        </div>
                                    </>)
                                    handleModalShow()
                                }) : (
                                    undefined
                                )}
                            >
                                {statusContent(exercise.status)}
                            </td>
                        ))
                        }
                    </tr >
                ))}
            </tbody >
        ) : (
            <p className="p-2">
                No results found. <br></br>
                <span className="text-muted small">Make sure there are exercises in the session, and students registered on the course.</span>
            </p>
        );
    };

    return isResultsSuccess ? (<>

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

        <Container className='overflow-scroll p-0 m-0 rounded-4'>
            <Table hover className='mb-0'>
                {tableHeadContent(results)}
                {tableBodyContent(results)}
            </Table>
        </Container>
    </>) : (
        <p className="p-3 border rounded">
            Unable to fetch results. Please try again later.
        </p>
    );
};

export default ResultsTable;
