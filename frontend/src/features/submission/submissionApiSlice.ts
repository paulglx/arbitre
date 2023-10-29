import { apiSlice } from "../../app/api/apiSlice";

export const submissionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createSubmission: builder.mutation<{}, FormData>({
            query: (data: any) => {
                return ({
                    url: 'runner/api/submission/',
                    method: 'POST',
                    credentials: 'include',
                    body: data
                })
            }
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
        getSubmissionByExerciseAndUser: builder.query({
            query: params => ({
                url: `/runner/api/submission?exercise_id=${params.exercise_id}&user_id=${params.user_id}`,
                method: 'GET',
            })
        }),
        getSubmissionTestResults: builder.query({
            query: params => ({
                url: `/runner/api/testresult?exercise_id=${params.exercise_id}&user_id=${params.user_id || ''}`,
                method: 'GET',
            })
        }),
        getSubmissionFileContent: builder.query({
            query: params => ({
                url: `/runner/api/submission-file?submission_id=${params.submission_id}`,
                method: 'GET',
            })
        }),
        requeueSubmissions: builder.mutation({
            query: params => ({
                url: `/runner/api/requeue-submissions?exercise_id=${params.exercise_id}`,
                method: 'GET',
            })
        }),
    })
})

export const {
    useCreateSubmissionMutation,
    useGetSubmissionByExerciseAndUserQuery,
    useGetSubmissionByExerciseQuery,
    useGetSubmissionQuery,
    useGetSubmissionTestResultsQuery,
    useGetSubmissionFileContentQuery,
    useRequeueSubmissionsMutation,
} = submissionApiSlice;