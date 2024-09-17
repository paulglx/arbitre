import { apiSlice } from "../../app/api/apiSlice";

export const testApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTestsOfExercise: builder.query({
            query: data => ({
                url: `/runner/api/test?exercise_id=${data.exercise_id}`,
                method: 'GET',
            }),
            providesTags: ["Tests"]
        }),
        createTest: builder.mutation({
            query: (data: any) => ({
                url: '/runner/api/test/',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Tests']
        }),
        updateTest: builder.mutation({
            query: (data: any) => ({
                url: `/runner/api/test/${data.id}/`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Tests']
        }),
        deleteTest: builder.mutation({
            query: (data: any) => ({
                url: `/runner/api/test/${data.id}/`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Tests']
        }),
        uploadRawTests: builder.mutation({
            query: (data: any) => ({
                url: `/runner/api/tests-raw/?exercise_id=${data.exercise_id}`,
                method: "POST",
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Tests']
        })
    })
})

export const {
    useGetTestsOfExerciseQuery,
    useCreateTestMutation,
    useUpdateTestMutation,
    useDeleteTestMutation,
    useUploadRawTestsMutation
} = testApiSlice;