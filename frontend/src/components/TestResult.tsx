import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useGetSubmissionTestResultsQuery } from '../features/submission/submissionApiSlice'

const TestResult = () => {

    const { exercise_id } : any = useParams();
    const owner = 1;

    const [resultsExist, setResultsExist] = useState(false);

    const {
        data: testResult,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetSubmissionTestResultsQuery({exercise_id:exercise_id, owner:owner});

    useEffect(() => {
        setResultsExist( typeof testResult !== 'undefined' && testResult.length > 0 )
    }, [testResult])

    return resultsExist ? (    
        <div>Coucou</div>
    ) : (
        <div>Submit your code to see the test results</div>
    )
}

export default TestResult