import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, keycloakToken: null, keycloakRefreshToken: null, roles: [] },
    reducers: {
        setCredentials: (state, action) => {
            const { user, keycloakToken, keycloakRefreshToken, roles } = action.payload
            state.user = user;
            state.keycloakToken = keycloakToken;
            state.keycloakRefreshToken = keycloakRefreshToken;
            state.roles = roles;
        },
        logOut: (state, action) => {
            state.user = null;
            state.keycloakToken = null;
            state.keycloakRefreshToken = null;
            state.roles = [];
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: any) => state.auth.user
export const selectCurrentKeycloakToken = (state: any) => state.auth.keycloakToken
export const selectCurrentKeycloakRefreshToken = (state: any) => state.auth.keycloakRefreshToken
export const selectCurrentRoles = (state: any) => state.auth.roles
export const selectIsTeacher = (state: any) => state.auth.roles.includes(2)