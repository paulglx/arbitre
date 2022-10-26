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
        createCourse: builder.mutation({
            query: (data:any) => {
                return (
                    {
                        url: '/api/course/',
                        method: 'POST',
                        credentials: 'include',
                        body: data //Must include : title, description. Optional fields : students
                    }
                )
            }
        }),
        deleteCourse: builder.mutation({
            query: (id:any) => {
                return (
                    {
                        url: `/api/course/${id}/`,
                        method: 'DELETE',
                        credentials: 'include',
                    }
                )
            }
        })
    })
})

export const {
    useGetCourseQuery,
    useGetAllCoursesQuery,
    useCreateCourseMutation,
    useDeleteCourseMutation
} = courseApiSlice;