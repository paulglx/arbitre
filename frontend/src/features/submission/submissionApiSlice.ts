import { apiSlice } from "../../app/api/apiSlice";

export const submissionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createSubmission: builder.mutation<{}, FormData>({
            query: (data:any) => {
                return ({
                    url: 'runner/api/submission/',
                    method: 'POST',
                    credentials: 'include',
                    body: data
            })}
        }),
        getSubmission: builder.query({
            query: params => ({
                url: `/runner/api/submission/${params.submission_id}`,
                method: 'GET',
            })
        }),
        getSubmissionByExercise: builder.query({
            query: params => ({
                url: `/runner/api/submission?exercise_id=${params.exercise_id}`,
                method: 'GET',
            })
        }),
        getSubmissionTestResults: builder.query({
            query: params => ({
                url: `/runner/api/testresult?exercise_id=${params.exercise_id}`,
                method: 'GET',
            })
        }),
    })
})

export const {
    useCreateSubmissionMutation,
    useGetSubmissionQuery,
    useGetSubmissionByExerciseQuery,
    useGetSubmissionTestResultsQuery
} = submissionApiSlice;