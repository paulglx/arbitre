import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/api/auth/token/',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        logout: builder.mutation({
            query: credentials => ({
                url: '/api/auth/logout/',
                method:'POST',
                body: {...credentials}
            })
        }),
        register: builder.mutation({
            query: credentials => ({
                url: '/api/auth/users/',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        getGroups: builder.mutation({
            query: username => ({
                url: '/api/auth/users/groups',
                method: 'POST',
                body: {...username}
            })
        }),
    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetGroupsMutation 
} = authApiSlice;