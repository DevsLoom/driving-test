import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentUserType } from "~/src/types/currentUser";

type AuthState = {
    token: string | null;
    isAuthenticate: boolean;
    isTokenExpire: boolean;
    currentUser: CurrentUserType |  null;
};

const authSlice = createSlice({
    name: "auth",
    initialState: <AuthState>{
        token: null,
        isAuthenticate: false,
        currentUser: null,
    },
    reducers: {
        setCurrentUser: (state, action: PayloadAction<AuthState>) => {
            state.token = action.payload.token;
            state.isAuthenticate = action.payload.isAuthenticate;
            state.isTokenExpire = action.payload.isTokenExpire;

            state.currentUser = action.payload.currentUser;
        },
        clearCurrentUser: (state) => {
            state.token = null;
            state.isAuthenticate = false;
            state.isTokenExpire = false;

            state.currentUser = null;
        },
    },
});

export const { setCurrentUser, clearCurrentUser } = authSlice.actions;
export default authSlice.reducer;
