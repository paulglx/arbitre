import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { user:null, accessToken:null, refreshToken:null, roles:[] },
    reducers: {
        setCredentials: (state, action) => {
            const { user, access, refresh, roles } = action.payload;
            state.user = user;
            state.accessToken = access;
            state.refreshToken = refresh;
            state.roles = roles;
        },
        logOut: (state, action) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.roles = [];
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state:any) => state.auth.user
export const selectCurrentAccessToken = (state:any) => state.auth.accessToken
export const selectCurrentRefreshToken = (state:any) => state.auth.refreshToken
export const selectCurrentRoles = (state:any) => state.auth.roles
export const selectIsTeacher = (state:any) => state.auth.roles.includes(2)