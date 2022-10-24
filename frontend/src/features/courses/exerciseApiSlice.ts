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
    })
})

export const {
    useGetExerciseQuery,
    useGetExercisesOfSessionQuery
} = exerciseApiSlice;