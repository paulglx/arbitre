import { FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logOut, setCredentials } from '../../features/auth/authSlice';

import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    credentials: 'include',
    prepareHeaders: (headers: Headers, { getState }: any) => {
        const accessToken = getState().auth.accessToken
        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403 || result?.error?.status === 401) {
        const state: any = api.getState()
        const refreshResult = await baseQuery({
            url: '/api/auth/token/refresh/',
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "refresh": state.auth.refreshToken })
        }, api, extraOptions)

        if (refreshResult?.data) {
            const state: any = api.getState()
            //store new token
            api.dispatch(setCredentials({
                ...refreshResult.data,
                //keep refresh token, roles and user data
                refresh: state.auth.refreshToken,
                user: state.auth.user,
                roles: state.auth.roles
            }))
            //retry original query
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut({}))
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    refetchOnMountOrArgChange: true,
    endpoints: builder => ({})
})