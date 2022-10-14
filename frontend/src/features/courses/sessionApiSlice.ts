import { apiSlice } from "../../app/api/apiSlice";

export const sessionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSession: builder.query({
            query: params => ({
                url: `/api/session/${params.id}/`,
                method: 'GET',
            })
        }),
    })
})

export const {
    useGetSessionQuery
} = sessionApiSlice;