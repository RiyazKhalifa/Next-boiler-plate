"use client"

import { configureStore, combineReducers } from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore } from "redux-persist"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { userReducer, customerReducer } from "@/store/userSlice"

// Combine reducers if you have more slices
const rootReducer = combineReducers({
    user: userReducer,
    customer: customerReducer,
})

// Persist config
const persistConfig = {
    key: "root",
    storage,
}

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // required for redux-persist
        }),
})

export const persistor = persistStore(store)

// Custom Provider wrapper
export function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}
