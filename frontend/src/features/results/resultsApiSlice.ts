import { apiSlice } from "../../app/api/apiSlice";

export const resultsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getResultsOfUser: builder.query({
            query: params => ({
                url: `/api/results/${params.user_id}`,
                method: 'GET',
            })
        }),
        getResultsOfSession: builder.query({
            query: params => ({
                url: `/api/session_results/?session_id=${params.session_id}&groups=${params.groups ? params.groups : ''}`,
                method: 'GET',
            })
        }),

        getAllResults: builder.query({
            query: () => ({
                url: `/api/all_results`,
                method: 'GET',
            })
        }),
    }),
})

export const {
    useGetResultsOfUserQuery,
    useGetResultsOfSessionQuery,
    useGetAllResultsQuery,
} = resultsApiSlice;