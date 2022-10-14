import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    credentials: 'include',
    prepareHeaders: (headers:Headers, { getState }:any) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args:string | FetchArgs, api:BaseQueryApi, extraOptions:{}) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) { //originalStatus instead of status ?
        console.log('sending refresh token');
        const refreshResult = await baseQuery('/api/auth/token/refresh/', api, extraOptions)
        console.log(refreshResult)
        if (refreshResult?.data) {
            const state:any = api.getState()
            const user = state.auth.user
            //store new token
            api.dispatch(setCredentials({
                ...refreshResult.data,
                user
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
    endpoints: builder => ({})
})