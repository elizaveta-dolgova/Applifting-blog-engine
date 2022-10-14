import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    isAuthenticated: true,
    access_token: 'b40a9804-7278-40bf-ba33-074834bb59b5',
    userName: ''
}

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
        }
    }
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;