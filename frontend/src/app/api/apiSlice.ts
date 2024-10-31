import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: (process.env.REACT_APP_USE_HTTPS === "true" ? "https://" : "http://") + process.env.REACT_APP_API_URL,
  credentials: "include",
  prepareHeaders: (headers: Headers, { getState }: any) => {
    const keycloakToken = getState().auth.keycloakToken;
    if (keycloakToken) {
      headers.set("authorization", `Bearer ${keycloakToken}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  tagTypes: ["Course", "Owners_Tutors", "Students", "Groups", "Tests", "Session"],
  baseQuery,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({}),
});
