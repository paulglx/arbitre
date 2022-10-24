import { apiSlice } from "../../app/api/apiSlice";

export const sessionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSession: builder.query({
            query: params => ({
                url: `/api/session/${params.id}/`,
                method: 'GET',
            })
        }),
        getSessionsOfCourse: builder.query({
            query: params => ({
                url: `/api/session?course_id=${params.course_id}`,
                method: 'GET',
            })
        }),
    })
})

export const {
    useGetSessionQuery,
    useGetSessionsOfCourseQuery
} = sessionApiSlice;