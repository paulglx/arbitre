import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, keycloakToken: null, keycloakRefreshToken: null, isTeacher: [] },
    reducers: {
        setCredentials: (state, action) => {
            const { user, keycloakToken, keycloakRefreshToken, isTeacher } = action.payload
            state.user = user;
            state.keycloakToken = keycloakToken;
            state.keycloakRefreshToken = keycloakRefreshToken;
            state.isTeacher = isTeacher;
        },
        logOut() { }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: any) => state.auth.user
export const selectCurrentKeycloakToken = (state: any) => state.auth.keycloakToken
export const selectCurrentKeycloakRefreshToken = (state: any) => state.auth.keycloakRefreshToken
export const selectIsTeacher = (state: any) => state.auth.isTeacher