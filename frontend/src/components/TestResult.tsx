import { Badge, Button, ListGroup, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useGetSubmissionByExerciseAndUserQuery, useGetSubmissionTestResultsQuery } from '../features/submission/submissionApiSlice'

import CodePreview from './CodePreview';
import moment from 'moment';

const TestResult = (props: any) => {

    const exercise_id = props.exercise_id;
    const [pollingInterval, setPollingInterval] = useState(125)
    const user_id = props.user_id || "";
    const [showCodePreview, setShowCodePreview] = useState(false)
    const [skipQueries, setSkipQueries] = useState(false)

    const {
        data: testResults,
    } = useGetSubmissionTestResultsQuery({ exercise_id: exercise_id, user_id: user_id }, {
        pollingInterval: skipQueries ? 0 : pollingInterval
    });

    const {
        data: submissionData,
    } = useGetSubmissionByExerciseAndUserQuery({ exercise_id: exercise_id, user_id: user_id }, {
        pollingInterval: skipQueries ? 0 : pollingInterval,
    });

    useEffect(() => {
        if (!submissionData || !testResults) { return }

        if (submissionData[0]?.status === "pending" || submissionData[0]?.status === "running" || testResults?.some((result: any) => result.status === "running" || result.status === "pending")) {
            setSkipQueries(false)
            setPollingInterval(p => p * 2)
        }
        else {
            setSkipQueries(true)
        }
    }, [submissionData, testResults])

    const testResultContent = (result: any) => {
        if (result.running) {
            return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        } else {
            return <span className="font-monospace"> <span className='text-muted text-decoration-underline'>OUTPUT:</span>&nbsp;{result.stdout}</span>
        }
    }

    const statusPillContent = (result: any) => {
        if (result.status === "running") {
            return (<>
                <span className="spinner-border spinner-border-sm p-1 m-1" role="status" aria-hidden="true"></span>
            </>)
        }
        else if (result.status === "pending") {
            return (<>
                <Badge bg="secondary">Pending</Badge>
            </>)
        }
        else if (result.status === "success") {
            return (<>
                <Badge bg="light" className='border border-secondary text-secondary'>{result.time} s</Badge>
                &nbsp;
                <Badge bg="success">Success</Badge>
            </>)
        }
        else if (result.status === "failed") {
            return (<>
                <Badge bg="secondary">Fail</Badge>
            </>)
        }
        else if (result.status === "error") {
            return (<>
                <Badge bg="danger">Error</Badge>
            </>)
        }
    }

    const statusContent = (status: string) => {
        if (status === "running") {
            return (
                <Spinner animation="border" role="status" as="span" size="sm">
                    <span className="visually-hidden">Running...</span>
                </Spinner>
            )
        }
        else if (status === "PENDING" || status === "pending") {
            return <Badge bg="secondary">Pending</Badge>
        }
        else if (status === "success") {
            return <Badge bg="success">Success</Badge>
        }
        else if (status === "failed") {
            return <Badge bg="secondary">Fail</Badge>
        }
        else if (status === "error") {
            return <Badge bg="danger">Error</Badge>
        }
    }

    const time_badge = (time: string) => {
        return <OverlayTrigger
            placement='auto'
            overlay={
                <Tooltip>
                    {moment(time).format('MMMM Do YYYY, h:mm:ss a')}
                </Tooltip>
            }
        >
            <Badge bg="secondary" className='ms-2'>
                {moment(time).fromNow()}
            </Badge>
        </OverlayTrigger>
    }

    if (!submissionData || !testResults) {
        return <>
            {/* <p className='text-danger'>There was an error while trying to display the test results.</p>
            <p>Try submitting the file again.</p> */}
        </>
    }

    return (submissionData && submissionData.length > 0) ? (<>

        <Modal show={showCodePreview} onHide={() => { setShowCodePreview(false) }} size="lg" fullscreen="md-down">
            <Modal.Header closeButton>
                <Modal.Title>{submissionData[0]?.file?.split("/").pop()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CodePreview submissionId={submissionData[0].id} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { setShowCodePreview(false) }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

        <ListGroup>
            <ListGroup.Item className={'bg-light d-flex justify-content-between align-items-start'}>
                <span className='fw-bold'>
                    {submissionData[0]?.file?.split("/").pop()}
                    &nbsp;
                    <span
                        role="button"
                        className='text-secondary text-decoration-underline'
                        onClick={() => { setShowCodePreview(true) }}
                    >
                        View file
                    </span>

                    {time_badge(submissionData[0].created)}

                </span>
                {statusContent(submissionData[0].status)}
            </ListGroup.Item>

            {testResults.map((result: any, i: number) => (
                <ListGroup.Item className='d-flex justify-content-between align-items-start' key={i}>
                    <div className='ms-2 me-auto'>
                        <div className="fw-bold">
                            {result.exercise_test.name}
                        </div>
                        {testResultContent(result)}
                    </div>
                    {statusPillContent(result)}
                </ListGroup.Item>
            ))}

        </ListGroup>
    </>) : (<></>)
}

export default TestResult
