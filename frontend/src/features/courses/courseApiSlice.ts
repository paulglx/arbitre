import { apiSlice } from "../../app/api/apiSlice";

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourse: builder.query({
      query: (params) => ({
        url: `/api/course/${params.id}/`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getAllCourses: builder.query({
      query: (params) => ({
        url: `/api/course/`,
        method: "GET",
      }),
    }),
    getCoursesSessions: builder.query({
      query: (params) => ({
        url: `/api/courses_sessions/`,
        method: "GET",
      }),
    }),
    createCourse: builder.mutation({
      query: (data: any) => {
        return {
          url: "/api/course/",
          method: "POST",
          credentials: "include",
          body: data, //Must include : title, description. Optional fields : students
        };
      },
    }),
    updateCourse: builder.mutation({
      query: (data: any) => ({
        url: `/api/course/${data.id}/`,
        method: "PUT",
        credentials: "include",
        body: data, //Must include : title, description. Optional fields : students
      }),
      invalidatesTags: ["Course"],
    }),
    deleteCourse: builder.mutation({
      query: (id: any) => {
        return {
          url: `/api/course/${id}/`,
          method: "DELETE",
          credentials: "include",
        };
      },
    }),
    getOwners: builder.query({
      query: (params) => ({
        url: `/api/course_owner?course_id=${params.course_id}`,
        method: "GET",
      }),
      providesTags: ['Owners_Tutors']
    }),
    addOwner: builder.mutation({
      query: (data: any) => ({
        url: `/api/course_owner/`,
        method: "POST",
        credentials: "include",
        body: data, //Must include : course_id, user_id
      }),
      invalidatesTags: ["Owners_Tutors"],
    }),
    removeOwner: builder.mutation({
      query: (data: any) => ({
        url: `/api/course_owner/${data.course_id}/`,
        method: "DELETE",
        credentials: "include",
        body: { user_id: data.user_id }, //Must include : course_id, user_id
      }),
      invalidatesTags: ["Owners_Tutors"],
    }),
    getTutors: builder.query({
      query: (params) => ({
        url: `/api/course_tutor?course_id=${params.course_id}`,
        method: "GET",
      }),
      providesTags: ['Owners_Tutors']
    }),
    addTutor: builder.mutation({
      query: (data: any) => ({
        url: `/api/course_tutor/`,
        method: "POST",
        credentials: "include",
        body: data, //Must include : course_id, user_id
      }),
      invalidatesTags: ["Owners_Tutors"],
    }),
    removeTutor: builder.mutation({
      query: (data: any) => ({
        url: `/api/course_tutor/${data.course_id}/`,
        method: "DELETE",
        credentials: "include",
        body: { user_id: data.user_id }, //Must include : course_id, user_id
      }),
      invalidatesTags: ["Owners_Tutors"],
    }),
    getStudents: builder.query({
      query: (params) => ({
        url: `/api/course_student?course_id=${params.course_id}`,
        method: "GET",
      }),
      providesTags: ['Students']
    }),
    addStudent: builder.mutation({
      query: (data: any) => ({
        url: `/api/course_student/`,
        method: "POST",
        credentials: "include",
        body: data, //Must include : course_id, user_id
      }),
      invalidatesTags: ["Students"]
    }),
    removeStudent: builder.mutation({
      query: (data: any) => ({
        url: `/api/course_student/${data.course_id}/`,
        method: "DELETE",
        credentials: "include",
        body: { user_id: data.user_id },
      }),
      invalidatesTags: ["Students"]
    }),
    updateLanguage: builder.mutation({
      query: (data: any) => ({
        url: `/api/course/${data.course_id}/`,
        method: "PATCH",
        credentials: "include",
        body: { language: data.language },
      }),
    }),
    joinCourseWithCode: builder.mutation({
      query: (data: any) => ({
        url: `/api/course_join/`,
        method: "POST",
        credentials: "include",
        body: data, //Must include : join_code
      }),
    }),
    refreshJoinCode: builder.mutation({
      query: (data: any) => ({
        url: `/api/course_refresh_code/`,
        method: "POST",
        credentials: "include",
        body: data, //Must include : course_id
      }),
    }),
    setJoinCodeEnabled: builder.mutation({
      query: (data: any) => ({
        url: `/api/course_join_code_enabled/`,
        method: "POST",
        credentials: "include",
        body: data, //Must include : course_id, enabled
      }),
    }),
    cloneCourse: builder.mutation({
      query: (data: any) => ({
        url: `api/course_clone/`,
        method: "POST",
        credentials: "include",
        body: data, // Must include : course_id
      }),
    }),
  }),
});

export const {
  useAddOwnerMutation,
  useAddStudentMutation,
  useAddTutorMutation,
  useCloneCourseMutation,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseQuery,
  useGetCoursesSessionsQuery,
  useGetOwnersQuery,
  useGetStudentsQuery,
  useGetTutorsQuery,
  useJoinCourseWithCodeMutation,
  useRefreshJoinCodeMutation,
  useRemoveOwnerMutation,
  useRemoveStudentMutation,
  useRemoveTutorMutation,
  useSetJoinCodeEnabledMutation,
  useUpdateCourseMutation,
  useUpdateLanguageMutation,
} = courseApiSlice;
