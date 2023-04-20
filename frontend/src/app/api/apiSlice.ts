import { FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { logOut } from '../../features/auth/authSlice';

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

const baseQueryWithLogoutCheck = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    let result = await baseQuery(args, api, extraOptions);
    const state: any = api.getState()

    if (result?.error?.status === 401 && state.auth.keycloakToken) {
        console.log("Token expired but still in store, logging out")
        api.dispatch(logOut({}))
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithLogoutCheck,
    refetchOnMountOrArgChange: true,
    endpoints: builder => ({})
})