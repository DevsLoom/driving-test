import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { RootState } from "../..";
import { API_URL, jsonHeaders } from "../config";

const roles = createApi({
    reducerPath: "rolesApi",
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
    tagTypes: ["Roles", "Role", "Permissions"],
    endpoints: (builder) => ({
        fetchPermissions: builder.query({
            query: (params) => `/permissions${params ? `?${params}` : ""}`,
            transformResponse: (response: { data: any }) => response?.data,
            providesTags: ["Permissions"],
        }),

        fetchRoles: builder.query({
            query: (params) => `/roles${params ? `?${params}` : ""}`,
            transformResponse: (response: { data: any }) => response?.data,
            providesTags: ["Roles"],
        }),

        createRole: builder.mutation({
            query: (data) => ({
                url: "/roles",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Roles"],
        }),

        fetchRole: builder.query({
            query: (id) => `/roles/${id}`,
            transformResponse: (response: { data: any }) => response.data,
            providesTags: ["Role"],
        }),

        updateRole: builder.mutation({
            query: (data) => ({
                url: `/roles/${data.id}`,
                method: "PUT",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Roles"],
        }),

        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/roles/${id}`,
                method: "DELETE",
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Roles"],
        }),
    }),
});

export const {
    useFetchPermissionsQuery,

    useFetchRolesQuery,
    useCreateRoleMutation,
    useFetchRoleQuery,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
} = roles;

export default roles;
