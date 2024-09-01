import { apiSlice } from "../../app/api/apiSlice";

export const studentGroupApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCourseStudentGroups: builder.query({
            query: params => ({
                url: `/api/student_group?course_id=${params.course_id}`,
                method: 'GET',
            }),
            providesTags: ["Students"]
        }),
        addStudentGroup: builder.mutation({
            query: (data: any) => ({
                url: `/api/student_group/`,
                method: 'POST',
                credentials: 'include',
                body: {
                    course: data.course,
                    name: data.name,
                }
            }),
            invalidatesTags: ["Students"]
        }),
        removeStudentGroup: builder.mutation({
            query: (data: any) => ({
                url: `/api/student_group/${data.id}/`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ["Students"]
        }),
        changeStudentGroup: builder.mutation({
            query: (data: any) => ({
                url: `/api/student_group/${data.id}/`,
                method: 'PATCH',
                credentials: 'include',
                body: {
                    name: data.name,
                }
            }),
            invalidatesTags: ["Students"]
        }),
        setGroupsEnabled: builder.mutation({
            query: (data: any) => ({
                url: `/api/course/${data.course_id}/`,
                method: 'PATCH',
                credentials: 'include',
                body: { groups_enabled: data.groups_enabled }
            })
        }),
        setAutoGroups: builder.mutation({
            query: (data: any) => ({
                url: `/api/course/${data.course_id}/`,
                method: 'PATCH',
                credentials: 'include',
                body: { auto_groups_enabled: data.auto_groups_enabled, }
            }),
            invalidatesTags: ["Students"]
        }),
        setGroupOfStudent: builder.mutation({
            query: (data: any) => ({
                url: `/api/set_student_group/`,
                method: 'POST',
                credentials: 'include',
                body: {
                    user_id: data.user_id,
                    student_group: data.student_group,
                }
            }),
            invalidatesTags: ["Students"]
        }),
    })
})

export const {
    useAddStudentGroupMutation,
    useRemoveStudentGroupMutation,
    useChangeStudentGroupMutation,
    useGetCourseStudentGroupsQuery,
    useSetAutoGroupsMutation,
    useSetGroupsEnabledMutation,
    useSetGroupOfStudentMutation,
} = studentGroupApiSlice;