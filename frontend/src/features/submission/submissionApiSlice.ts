import { apiSlice } from "../../app/api/apiSlice";

export const submissionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createSubmission: builder.mutation<{}, FormData>({
            query: (data:any) => {
                console.log(data)
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
        getSubmissionTestResults: builder.query({
            query: params => ({
                url: `/runner/api/testresult?exercise_id=${params.exercise_id}&owner=${params.owner}`,
                method: 'GET',
            })
        }),
    })
})

export const {
    useCreateSubmissionMutation,
    useGetSubmissionQuery,
    useGetSubmissionTestResultsQuery
} = submissionApiSlice;