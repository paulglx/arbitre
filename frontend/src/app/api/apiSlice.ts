import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: window.location.protocol + '//' + window.location.hostname,
    credentials: 'include',
    prepareHeaders: (headers: Headers, { getState }: any) => {
        const keycloakToken = getState().auth.keycloakToken
        if (keycloakToken) {
            headers.set("authorization", `Bearer ${keycloakToken}`)
        }
        return headers
    }
})

export const apiSlice = createApi({
    baseQuery,
    refetchOnMountOrArgChange: true,
    endpoints: builder => ({})
})