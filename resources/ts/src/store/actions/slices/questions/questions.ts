import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { RootState } from '~/src/store';
import { API_URL, jsonHeaders } from '../../config';

const questions = createApi({
	reducerPath: 'questionsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: API_URL + '/question-manage',
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
	tagTypes: ['Questions', 'Question'],

	endpoints: (builder) => ({
		fetchQuestions: builder.query({
			query: (params) => `/questions${params ? `?${params}` : ''}`,
			transformResponse: (response: { data: any }) => response?.data,
			providesTags: ['Questions'],
		}),

		createQuestion: builder.mutation({
			query: (data) => ({
				url: '/questions',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			transformErrorResponse: (response) => response.data,
			invalidatesTags: ['Questions'],
		}),

		fetchQuestion: builder.query({
			query: (id) => `/questions/${id}`,
			transformResponse: (response: { data: any }) => response.data,
			providesTags: ['Question'],
		}),

		updateQuestion: builder.mutation({
			query: (data) => ({
				url: `/questions/${data.id}`,
				method: 'PATCH',
				body: JSON.stringify(data),
			}),
			transformErrorResponse: (response) => response.data,
			invalidatesTags: ['Questions'],
		}),

		deleteQuestion: builder.mutation({
			query: (id) => ({
				url: `/questions/${id}`,
				method: 'DELETE',
			}),
			transformErrorResponse: (response) => response.data,
			invalidatesTags: ['Questions'],
		}),
	}),
});

export const {
	useFetchQuestionsQuery,
	useCreateQuestionMutation,
	useFetchQuestionQuery,
	useUpdateQuestionMutation,
	useDeleteQuestionMutation,
} = questions;

export default questions;
