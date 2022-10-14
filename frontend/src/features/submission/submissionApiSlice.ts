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
    })
})

export const {
    useCreateSubmissionMutation,
} = submissionApiSlice;