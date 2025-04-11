import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { RootState } from "../..";
import { API_URL, jsonHeaders } from "../config";

const users = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        headers: jsonHeaders,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState;
            const token = state.auth.token ?? Cookies.get("_secret") ?? null;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    keepUnusedDataFor: 10,
    refetchOnReconnect: true,
    tagTypes: ["Users", "User"],
    endpoints: (builder) => ({
        fetchUsers: builder.query({
            query: (params) => `/users${params ? `?${params}` : ""}`,
            transformResponse: (response: { data: any }) => response?.data,
            providesTags: ["Users"],
        }),

        createUser: builder.mutation({
            query: (data) => ({
                url: "/users",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Users"],
        }),

        fetchUser: builder.query({
            query: (id) => `/users/${id}`,
            transformResponse: (response: { data: any }) => response.data,
            providesTags: ["User"],
        }),

        updateUser: builder.mutation({
            query: (data) => ({
                url: `/users/${data.id}`,
                method: "PATCH",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Users"],
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useFetchUsersQuery,
    useCreateUserMutation,
    useFetchUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = users;

export default users;
