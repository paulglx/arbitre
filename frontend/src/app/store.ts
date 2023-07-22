import { persistReducer, persistStore } from "redux-persist";

import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice"
import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "../features/notification/notificationSlice";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'main-root',
    storage,
    whitelist: ['auth'],
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer)

const rootAuthReducer = (state: any, action: any) => {
    if (action.type === 'auth/logOut') {
        storage.removeItem('persist:main-root')
        state = {} as any
    }
    return persistedAuthReducer(state, action)
}

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        notification: notificationSlice,
        auth: rootAuthReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware),
    devTools: JSON.parse(process.env.REACT_APP_DEV_TOOLS ? process.env.REACT_APP_DEV_TOOLS : "false"),
})

export default store

export const Persistor = persistStore(store)