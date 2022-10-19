import { apiSlice } from "../../app/api/apiSlice";

export const courseApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCourse: builder.query({
            query: params => ({
                url: `/api/course/${params.id}/`,
                method: 'GET',
            })
        }),
        getAllCourses: builder.query({
            query: params => ({
                url: `/api/course/`,
                method: 'GET',
            })
        }),
    })
})

export const {
    useGetCourseQuery,
    useGetAllCoursesQuery,
} = courseApiSlice;