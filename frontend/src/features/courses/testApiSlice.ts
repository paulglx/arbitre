import { apiSlice } from "../../app/api/apiSlice";

export const testApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTestsOfExercise: builder.query({
            query: data => ({
                url: `/runner/api/test?exercise_id=${data.exercise_id}`,
                method: 'GET',
            })
        }),
        createTest: builder.mutation({
            query: (data:any) => {
                return (
                    {
                        url: '/runner/api/test/',
                        method: 'POST',
                        credentials: 'include',
                        body: data,
                    }
                )
            }
        }),
        updateTest: builder.mutation({
            query: (data:any) => {
                return (
                    {
                        url: `/runner/api/test/${data.id}/`,
                        method: 'PUT',
                        credentials: 'include',
                        body: data,
                    }
                )
            }
        }),
        deleteTest: builder.mutation({
            query: (data:any) => {
                return (
                    {
                        url: `/runner/api/test/${data.id}/`,
                        method: 'DELETE',
                        credentials: 'include',
                    }
                )
            }
        }),
    })
})

export const {
    useGetTestsOfExerciseQuery,
    useCreateTestMutation,
    useUpdateTestMutation,
    useDeleteTestMutation
} = testApiSlice;