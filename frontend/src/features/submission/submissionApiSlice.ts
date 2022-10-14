import { apiSlice } from "../../app/api/apiSlice";

export const submissionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createSubmission: builder.mutation({
            query: data => ({
                url: 'runner/api/submission/',
                method: 'POST',
                body: { ...data }
            })
        }),
    })
})

export const {
    useCreateSubmissionMutation,
} = submissionApiSlice;