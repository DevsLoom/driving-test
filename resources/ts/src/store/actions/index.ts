import auth from './slices/auth';
import { globalApiMiddleWares, globalApiReducers } from './slices/global';
import summaries from './slices/global/summaries';
import { questionsApiMiddleWares, questionsApiReducers } from './slices/questions';
import roles from './slices/roles';
import tests from './slices/tests';
import users from './slices/users';

export const apiReducers = {
	[auth.reducerPath]: auth.reducer,
	[tests.reducerPath]: tests.reducer,
	[summaries.reducerPath]: summaries.reducer,
	[roles.reducerPath]: roles.reducer,
	[users.reducerPath]: users.reducer,
    
	...globalApiReducers,
	...questionsApiReducers,
};

export const apiMiddleWares = [
	auth.middleware,
	tests.middleware,
	summaries.middleware,
	roles.middleware,
	users.middleware,

	...globalApiMiddleWares,
	...questionsApiMiddleWares,
];
