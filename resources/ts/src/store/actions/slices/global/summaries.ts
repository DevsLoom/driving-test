import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';
import { RootState } from "~/src/store";
import { API_URL, jsonHeaders } from "../../config";

const summaries = createApi({
  reducerPath: "summariesApi",
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
  tagTypes: ["Summaries"],
  
  endpoints: (builder) => ({
    fetchSummaries: builder.query({
      query: (params) => `/summaries${params ? `?${params}`: ''}`,
      transformResponse: (response: { data: any }) => response?.data,
      providesTags: ["Summaries"],
    }),
  }),
});

export const {
  useFetchSummariesQuery,
} = summaries;

export default summaries;
