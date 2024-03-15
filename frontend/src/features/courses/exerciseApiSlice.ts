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
            query: (data: any) => {
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
            query: (data: any) => {
                return (
                    {
                        url: `/api/exercise/${data.id}/`,
                        method: 'PATCH',
                        credentials: 'include',
                        body: data,
                    }
                )
            }
        }),
        deleteExercise: builder.mutation({
            query: (data: any) => {
                return (
                    {
                        url: `/api/exercise/${data.id}/`,
                        method: 'DELETE',
                        credentials: 'include',
                    }
                )
            }
        }),
        setTeacherFiles: builder.mutation({
            query: (data: any) => {
                const formData = new FormData();
                formData.append('teacher_files', data.teacher_files);

                return ({
                    body: formData,
                    credentials: 'include',
                    formData: true,
                    method: 'PATCH',
                    url: `/api/exercise/${data.id}/`,
                })
            }
        }),
        removeTeacherFiles: builder.mutation({
            query: (data: any) => {

                const body = {
                    "teacher_files": null,
                }

                return ({
                    body: body,
                    credentials: 'include',
                    method: 'PATCH',
                    url: `/api/exercise/${data.id}/`,
                })
            }
        })
    })
})

export const {
    useGetExerciseQuery,
    useGetExercisesOfSessionQuery,
    useCreateExerciseMutation,
    useUpdateExerciseMutation,
    useDeleteExerciseMutation,
    useSetTeacherFilesMutation,
    useRemoveTeacherFilesMutation
} = exerciseApiSlice;