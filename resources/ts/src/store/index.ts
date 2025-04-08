import { configureStore } from "@reduxjs/toolkit";
import { apiMiddleWares, apiReducers } from "./actions";
import auth from './reducers/auth';

const store = configureStore({
    reducer: {
        ...apiReducers,
        auth,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiMiddleWares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
