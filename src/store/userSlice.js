import { createSlice } from "@reduxjs/toolkit"

// -------------------- User Slice --------------------
const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        setUser: (state, action) => action.payload,
        clearUser: () => null,
    },
})

// -------------------- Customer Slice --------------------
const customerSlice = createSlice({
    name: "customer",
    initialState: null,
    reducers: {
        setCustomer: (state, action) => action.payload,
        clearCustomer: () => null,
    },
})

// -------------------- Permissions Slice --------------------
const permissionsSlice = createSlice({
    name: 'permissions',
    initialState: null,
    reducers: {
        setPermissions: (state, action) => action.payload,
        clearPermissions: () => null
    }
})

// Export actions
export const { setUser, clearUser } = userSlice.actions
export const { setCustomer, clearCustomer } = customerSlice.actions
export const { setPermissions, clearPermissions } = permissionsSlice.actions

// Export reducers to use in store
export const userReducer = userSlice.reducer
export const customerReducer = customerSlice.reducer
export const permissionsReducer = permissionsSlice.reducer
