import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';
import { RootState } from "~/src/store";
import { API_URL, jsonHeaders } from "../../config";

const tags = createApi({
  reducerPath: "tagsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    headers: jsonHeaders,
    prepareHeaders: (headers, { getState }) => {
			const state = getState() as RootState;
			const token = state.auth.token ?? Cookies.get('_secret') ?? null;
			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}
			return headers;
		},
  }),

  keepUnusedDataFor: 5,
  refetchOnReconnect: true,
  tagTypes: ["Tags", "Tag"],
  
  endpoints: (builder) => ({
    fetchTags: builder.query({
      query: (params) => `/tags${params ? `?${params}`: ''}`,
      transformResponse: (response: { data: any }) => response?.data,
      providesTags: ["Tags"],
    }),

    createTag: builder.mutation({
      query: (data) => ({
        url: "/tags",
        method: "POST",
        body: JSON.stringify(data),
      }),
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Tags"],
    }),

    fetchTag: builder.query({
      query: (id) => `/tags/${id}`,
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["Tag"],
    }),

    updateTag: builder.mutation({
      query: (data) => ({
        url: `/tags/${data.id}`,
        method: "PATCH",
        body: JSON.stringify(data),
      }),
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Tags"],
    }),

    deleteTag: builder.mutation({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Tags"],
    }),
  }),
});

export const {
  useFetchTagsQuery,
  useCreateTagMutation,
  useFetchTagQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tags;

export default tags;
