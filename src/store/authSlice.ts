import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    isAuthenticated: localStorage.getItem('isAuthenticated') ? true : false,
    access_token: localStorage.getItem('access_token') || '',
    userName: localStorage.getItem('userName') || '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.access_token = action.payload.token;
            state.userName = action.payload.userName;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.access_token = '';
            state.userName = '';
        }
    }
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
