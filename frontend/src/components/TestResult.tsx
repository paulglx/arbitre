import React, { useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetSubmissionTestResultsQuery } from '../features/submission/submissionApiSlice'

const TestResult = () => {

    const { exercise_id } : any = useParams();

    const [resultsExist, setResultsExist] = useState(false);

    const {
        data: testResults,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetSubmissionTestResultsQuery({exercise_id:exercise_id});

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
        if(result.success) {
            return (<>
                <span className="badge bg-secondary rounded-pill">{result.time} s</span>
                &nbsp;
                <span className="badge bg-success rounded-pill">Success</span>
            </>)
        }
        else if (result.running) {
            return (<>
                <span className="badge bg-secondary rounded-pill">Running</span>
            </>)
        }
        else {
            return (<>
                <span className="badge bg-danger rounded-pill">Fail</span>
            </>)
        }
    }

    return resultsExist ? (
        <ListGroup>
            <ListGroup.Item className='bg-light d-flex justify-content-between align-items-start'>
                {/* Get filename*/}
                <span className='fw-bold'>{testResults[0].submission.file.split("/").pop()}</span>
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