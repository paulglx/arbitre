import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/api/auth/users/',
            keepUnusedDataFor: 5, //caches the query for 5s
        }),
        getTeachers: builder.query({
            query: () => '/api/auth/teachers/',
        })
    })
})

export const {
    useGetUsersQuery,
    useGetTeachersQuery
} = usersApiSlice