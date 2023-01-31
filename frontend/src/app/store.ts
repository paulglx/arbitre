import { persistReducer, persistStore } from "redux-persist";

import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice"
import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "../features/notification/notificationSlice";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'main-root',
    storage,
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        notification: notificationSlice,
        auth: persistedAuthReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware),
    devTools: true, //TODO remove before prod
})

export default store

export const Persistor = persistStore(store)