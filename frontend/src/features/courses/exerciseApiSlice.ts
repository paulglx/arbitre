import { apiSlice } from "../../app/api/apiSlice";

export const exerciseApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getExercise: builder.query({
            query: params => ({
                url: `/api/exercise/${params.id}/`,
                method: 'GET',
            })
        }),
        getExercisesOfSession: builder.query({
            query: params => ({
                url: `/api/exercise?session_id=${params.session_id}`,
                method: 'GET',
            })
        }),
        createExercise: builder.mutation({
            query: (data:any) => {
                return (
                    {
                        url: '/api/exercise/',
                        method: 'POST',
                        credentials: 'include',
                        body: data,
                    }
                )
            }
        }),
        updateExercise: builder.mutation({
            query: (data:any) => {
                return (
                    {
                        url: `/api/exercise/${data.id}/`,
                        method: 'PUT',
                        credentials: 'include',
                        body: data,
                    }
                )
            }
        }),
        deleteExercise: builder.mutation({
            query: (data:any) => {
                return (
                    {
                        url: `/api/exercise/${data.id}/`,
                        method: 'DELETE',
                        credentials: 'include',
                    }
                )
            }
        }),
    })
})

export const {
    useGetExerciseQuery,
    useGetExercisesOfSessionQuery,
    useCreateExerciseMutation,
    useUpdateExerciseMutation,
    useDeleteExerciseMutation
} = exerciseApiSlice;