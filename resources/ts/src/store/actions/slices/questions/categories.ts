import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { RootState } from '~/src/store';
import { API_URL, jsonHeaders } from '../../config';

const questionCategories = createApi({
	reducerPath: 'questionCategoriesApi',
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
	tagTypes: ['QuestionCategories', 'QuestionCategory'],

	endpoints: (builder) => ({
		fetchQuestionCategories: builder.query({
			query: (params) => `/categories${params ? `?${params}` : ''}`,
			transformResponse: (response: { data: any }) => response?.data,
			transformErrorResponse: (response) => response.data,
			providesTags: ['QuestionCategories'],
		}),

		createQuestionCategory: builder.mutation({
			query: (data) => ({
				url: '/categories',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			transformErrorResponse: (response) => response.data,
			invalidatesTags: ['QuestionCategories'],
		}),

		fetchQuestionCategory: builder.query({
			query: (id) => `/categories/${id}`,
			transformResponse: (response: { data: any }) => response.data,
			providesTags: ['QuestionCategory'],
		}),

		updateQuestionCategory: builder.mutation({
			query: (data) => ({
				url: `/categories/${data.id}`,
				method: 'PATCH',
				body: JSON.stringify(data),
			}),
			transformErrorResponse: (response) => response.data,
			invalidatesTags: ['QuestionCategories'],
		}),

		deleteQuestionCategory: builder.mutation({
			query: (id) => ({
				url: `/categories/${id}`,
				method: 'DELETE',
			}),
			transformErrorResponse: (response) => response.data,
			invalidatesTags: ['QuestionCategories'],
		}),
	}),
});

export const {
	useFetchQuestionCategoriesQuery,
	useCreateQuestionCategoryMutation,
	useFetchQuestionCategoryQuery,
	useUpdateQuestionCategoryMutation,
	useDeleteQuestionCategoryMutation,
} = questionCategories;

export default questionCategories;
