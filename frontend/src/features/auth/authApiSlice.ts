import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getGroups: builder.mutation({
            query: username => ({
                url: '/api/auth/users/groups',
                method: 'POST',
                body: { ...username }
            })
        }),
    })
})

export const {
    /*     useLoginMutation,
        useRegisterMutation,
        useLogoutMutation, */
    useGetGroupsMutation
} = authApiSlice;