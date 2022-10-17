import React, { useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetSubmissionTestResultsQuery } from '../features/submission/submissionApiSlice'

const TestResult = () => {

    const { exercise_id } : any = useParams();
    const owner = 1;

    const [resultsExist, setResultsExist] = useState(false);

    const {
        data: testResults,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetSubmissionTestResultsQuery({exercise_id:exercise_id, owner:owner});

    useEffect(() => {
        setResultsExist( typeof testResults !== 'undefined' && testResults.length > 0 )
    }, [testResults])
    
    const testResultContent = (running:boolean, stdout:string) => {
        if (running) {
            return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        } else {
            return <span className="font-monospace">{ stdout }</span>
        }
    }

    const statusPillContent = (success:boolean, time:number) => {
        if(success) {
            return (<>
                <span className="badge bg-secondary rounded-pill">{time} s</span>
                &nbsp;
                <span className="badge bg-success rounded-pill">Success</span>
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
                <span className='fw-bold'>Test results</span>
            </ListGroup.Item>

            {testResults.map((result:any) => (
                <ListGroup.Item className='d-flex justify-content-between align-items-start'>
                    <div className='ms-2 me-auto'>
                        <div className="fw-bold">(test name)</div>
                        {testResultContent(result.running, result.stdout)}
                    </div>
                    {statusPillContent(result.success, result.time)}
                </ListGroup.Item>
            ))}

        </ListGroup>
    ) : (
        <div>Submit your code to see the test results</div>
    )
}

export default TestResult