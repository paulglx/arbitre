import { createSlice } from "@reduxjs/toolkit";

const lastVisitedSlice = createSlice({
    name: 'lastVisited',
    initialState: { dashboardSession: null },
    reducers: {
        setLastDashboardSession: (state, action) => {
            const { dashboardSession } = action.payload
            state.dashboardSession = dashboardSession;
        },
    },
})

export const { setLastDashboardSession } = lastVisitedSlice.actions

export default lastVisitedSlice.reducer

export const selectLastDashboardSession = (state: any) => state.lastVisited.dashboardSession