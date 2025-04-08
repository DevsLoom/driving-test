import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { RootState } from '~/src/store';
import { API_URL, jsonHeaders } from '../../config';

const tests = createApi({
	reducerPath: 'testsApi',
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
	tagTypes: ['Tests', 'Test'],

	endpoints: (builder) => ({
		fetchTests: builder.query({
			query: (params) => `/tests${params ? `?${params}` : ''}`,
			transformResponse: (response: { data: any }) => response?.data,
			transformErrorResponse: (response) => response.data,
			providesTags: ['Tests'],
		}),

		createTest: builder.mutation({
			query: (data) => ({
				url: '/tests',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			transformErrorResponse: (response) => response.data,
			invalidatesTags: ['Tests'],
		}),

		fetchTest: builder.query({
			query: (id) => `/tests/${id}`,
			transformResponse: (response: { data: any }) => response.data,
			providesTags: ['Test'],
		}),

		updateTest: builder.mutation({
			query: (data) => ({
				url: `/tests/${data.id}`,
				method: 'PATCH',
				body: JSON.stringify(data),
			}),
			transformErrorResponse: (response) => response.data,
			invalidatesTags: ['Tests'],
		}),

		deleteTest: builder.mutation({
			query: (id) => ({
				url: `/tests/${id}`,
				method: 'DELETE',
			}),
			transformErrorResponse: (response) => response.data,
			invalidatesTags: ['Tests'],
		}),
	}),
});

export const {
	useFetchTestsQuery,
	useCreateTestMutation,
	useFetchTestQuery,
	useUpdateTestMutation,
	useDeleteTestMutation,
} = tests;

export default tests;
