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
        updateCourse: builder.mutation({
            query: (data:any) => {
                return (
                    {
                        url: `/api/course/${data.id}/`,
                        method: 'PUT',
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
        }),
        getOwners: builder.query({
            query: params => ({
                url: `/api/course_owner?course_id=${params.course_id}`,
                method: 'GET',
            })
        }),
        addOwner: builder.mutation({
            query: (data:any) => ({
                url: `/api/course_owner/`,
                method: 'POST',
                credentials: 'include',
                body: data //Must include : course_id, user_id
            })
        }),
        removeOwner: builder.mutation({
            query: (data:any) => ({
                url: `/api/course_owner/${data.course_id}/`,
                method: 'DELETE',
                credentials: 'include',
                body: {user_id:data.user_id} //Must include : course_id, user_id
            })
        }),
        getTutors: builder.query({
            query: params => ({
                url: `/api/course_tutor?course_id=${params.course_id}`,
                method: 'GET',
            })
        }),
        addTutor: builder.mutation({
            query: (data:any) => ({
                url: `/api/course_tutor/`,
                method: 'POST',
                credentials: 'include',
                body: data //Must include : course_id, user_id
            })
        }),
        removeTutor: builder.mutation({
            query: (data:any) => ({
                url: `/api/course_tutor/${data.course_id}/`,
                method: 'DELETE',
                credentials: 'include',
                body: {user_id:data.user_id} //Must include : course_id, user_id
            })
        }),
    })
})

export const {
    useGetCourseQuery,
    useGetAllCoursesQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useGetOwnersQuery,
    useAddOwnerMutation,
    useRemoveOwnerMutation,
    useGetTutorsQuery,
    useAddTutorMutation,
    useRemoveTutorMutation,
} = courseApiSlice;