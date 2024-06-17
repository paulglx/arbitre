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
            query: data => ({
                url: '/api/exercise/',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
        }),
        updateExercise: builder.mutation({
            query: (data: any) => ({
                url: `/api/exercise/${data.id}/`,
                method: 'PATCH',
                credentials: 'include',
                body: data,
            })
        }),
        deleteExercise: builder.mutation({
            query: (data: any) => ({
                url: `/api/exercise/${data.id}/`,
                method: 'DELETE',
                credentials: 'include',
            }),
        }),
        getTeacherFiles: builder.query({
            query: params => ({
                url: `/api/exercise_teacher_files/?exercise_id=${params.id}`,
                method: 'GET',
                credentials: 'include',
            })
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
            query: data => ({
                url: `/api/exercise/${data.id}/`,
                method: 'PATCH',
                credentials: 'include',
                body: { "teacher_files": null },
            }),
        })
    })
})

export const {
    useGetExerciseQuery,
    useGetExercisesOfSessionQuery,
    useCreateExerciseMutation,
    useUpdateExerciseMutation,
    useDeleteExerciseMutation,
    useGetTeacherFilesQuery,
    useLazyGetTeacherFilesQuery,
    useSetTeacherFilesMutation,
    useRemoveTeacherFilesMutation,
} = exerciseApiSlice;