import { apiSlice } from "../../app/api/apiSlice";

export const sessionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSession: builder.query({
            query: params => ({
                url: `/api/session/${params.id}/`,
                method: 'GET',
            }),
            providesTags: ["Session"]
        }),
        getSessionsOfCourse: builder.query({
            query: params => ({
                url: `/api/session?course_id=${params.course_id}`,
                method: 'GET',
            }),
        }),
        createSession: builder.mutation({
            query: data => ({
                url: '/api/session/',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
        }),
        updateSession: builder.mutation({
            query: data => ({
                url: `/api/session/${data.id}/`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ["Session"]
        }),
        deleteSession: builder.mutation({
            query: data => ({
                url: `/api/session/${data.id}/`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ["Session"]
        }),
    })
})

export const {
    useGetSessionQuery,
    useGetSessionsOfCourseQuery,
    useCreateSessionMutation,
    useUpdateSessionMutation,
    useDeleteSessionMutation
} = sessionApiSlice;