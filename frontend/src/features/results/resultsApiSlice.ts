import { apiSlice } from "../../app/api/apiSlice";

export const resultsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getResultsOfUser: builder.query({
            query: params => ({
                url: `/api/results/${params.user_id}`,
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
    useGetAllResultsQuery,
} = resultsApiSlice;