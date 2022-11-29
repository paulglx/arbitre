import { useEffect, useState } from 'react'
import { useGetSubmissionByExerciseQuery, useGetSubmissionTestResultsQuery } from '../features/submission/submissionApiSlice'

import { ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const TestResult = () => {

    const { exercise_id } : any = useParams();

    const [resultsExist, setResultsExist] = useState(false);

    const {
        data: testResults,
        isSuccess,
    } = useGetSubmissionTestResultsQuery({exercise_id:exercise_id});

    const {
        data: submissionData,
        isSuccess: submissionIsSuccess,
    } = useGetSubmissionByExerciseQuery({exercise_id:exercise_id});

    useEffect(() => {
        setResultsExist( typeof testResults !== 'undefined' && testResults.length > 0 )
    }, [testResults])
    
    const testResultContent = (result:any) => {
        if (result.running) {
            return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        } else {
            return <span className="font-monospace">{ result.stdout }</span>
        }
    }

    const statusPillContent = (result:any) => {
        if (result.status === "running") {
            return (<>
                 <span className="spinner-border spinner-border-sm p-1 m-1" role="status" aria-hidden="true"></span>
            </>)
        }
        else if (result.status === "pending") {
            return (<>
                <span className="badge bg-secondary rounded-pill">Pending</span>
            </>)
        }
        else if(result.status === "success") {
            return (<>
                <span className="badge bg-secondary rounded-pill">{result.time} s</span>
                &nbsp;
                <span className="badge bg-success rounded-pill">Success</span>
            </>)
        }
        else if (result.status === "failed") {
                return (<>
                <span className="badge bg-danger rounded-pill">Fail</span>
            </>)
        }
        else if (result.status === "error") {
                return (<>
                <span className="badge bg-danger rounded-pill">Error</span>
            </>)
        }
    }

    const submissionStatusContent = (submission:any) => {
        if (submission.status === "running") {
            return (<>
                <span className="badge bg-secondary rounded-pill">Running</span>
            </>)
        }
        else if(submission.status === "success") {
            return (<>
                <span className="badge bg-success rounded-pill">Success</span>
            </>)
        }
        else if (submission.status === "failed") {
                return (<>
                <span className="badge bg-danger rounded-pill">Fail</span>
            </>)
        }
        else if (submission.status === "error") {
                return (<>
                <span className="badge bg-danger rounded-pill">Error</span>
            </>)
        }
        else if (submission.status === "pending") {
                return (<>
                <span className="badge bg-secondary rounded-pill">Pending</span>
            </>)
        }
    }



    return (submissionData && submissionIsSuccess && isSuccess && resultsExist) ? (
        <ListGroup>
            <ListGroup.Item className={'bg-light d-flex justify-content-between align-items-start'}>
                {/* Get filename*/}
                <span className='fw-bold'>{submissionData[0].file.split("/").pop()}</span>
                {/* Get submission status */}
                {submissionStatusContent(submissionData[0])}
            </ListGroup.Item>

            {testResults.map((result:any, i:number) => (
                <ListGroup.Item className='d-flex justify-content-between align-items-start' key={i}>
                    <div className='ms-2 me-auto'>
                        <div className="fw-bold">{result.exercise_test.name}</div>
                        {testResultContent(result)}
                    </div>
                    {statusPillContent(result)}
                </ListGroup.Item>
            ))}

        </ListGroup>
    ) : (
        <></>
    )
}

export default TestResult