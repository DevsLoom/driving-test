import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { API_URL, jsonHeaders } from "../config";

const auth = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        headers: jsonHeaders,
        prepareHeaders: (headers) => {
            const token = Cookies.get("_secret") || null;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),

    keepUnusedDataFor: 10,
    refetchOnReconnect: true,

    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response?.data,
        }),
        registerRequest: builder.mutation({
            query: (data) => ({
                url: "/auth/register/request",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response?.data,
        }),
        registerVerify: builder.mutation({
            query: (data) => ({
                url: "/auth/register/verify",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response?.data,
        }),

        regularLogin: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response?.data,
        }),

        logout: builder.mutation({
            query: (data) => ({
                url: "/auth/logout",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
        }),

        updateAuth: builder.mutation({
            query: (data) => ({
                url: "/auth/update",
                method: "PATCH",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: "/auth/change-password",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
        }),

        forgetRequest: builder.mutation({
            query: (data) => ({
                url: "/auth/forget/request",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
        }),

        forgetVerify: builder.mutation({
            query: (data) => ({
                url: "/auth/forget/verify",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
        }),

        forgetPassword: builder.mutation({
            query: (data) => ({
                url: "/auth/forget/password",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
        }),

        fetchMe: builder.query({
            query: () => "/auth/me",
            transformResponse: (response: { data: any }) => response?.data,
        }),
    }),
});

export const {
    useRegisterMutation,
    useRegisterRequestMutation,
    useRegisterVerifyMutation,

    useRegularLoginMutation,
    useLogoutMutation,

    useUpdateAuthMutation,
    useChangePasswordMutation,

    useForgetRequestMutation,
    useForgetVerifyMutation,
    useForgetPasswordMutation,

    useFetchMeQuery
} = auth;

export default auth;
