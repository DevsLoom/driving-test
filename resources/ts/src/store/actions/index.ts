import auth from './slices/auth';
import { globalApiMiddleWares, globalApiReducers } from './slices/global';
import summaries from './slices/global/summaries';
import { questionsApiMiddleWares, questionsApiReducers } from './slices/questions';
import tests from './slices/tests';

export const apiReducers = {
	[auth.reducerPath]: auth.reducer,
	[tests.reducerPath]: tests.reducer,
	[summaries.reducerPath]: summaries.reducer,
    
	...globalApiReducers,
	...questionsApiReducers,
};

export const apiMiddleWares = [
	auth.middleware,
	tests.middleware,
	summaries.middleware,

	...globalApiMiddleWares,
	...questionsApiMiddleWares,
];
