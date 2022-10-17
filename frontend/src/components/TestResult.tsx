import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useGetSubmissionTestResultsQuery } from '../features/submission/submissionApiSlice'

const TestResult = () => {

    const { id } : any = useParams();

    const {
        data: testResult,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetSubmissionTestResultsQuery({submission_id:id});


    console.log(testResult)

    return (    
        <></>
    )
}

export default TestResult