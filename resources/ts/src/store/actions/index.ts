import auth from './slices/auth';
import { globalApiMiddleWares, globalApiReducers } from './slices/global';
import { questionsApiMiddleWares, questionsApiReducers } from './slices/questions';
import { theoryApiMiddleWares, theoryApiReducers } from './slices/theory';

export const apiReducers = {
	[auth.reducerPath]: auth.reducer,
    
	...globalApiReducers,
	...theoryApiReducers,
	...questionsApiReducers,
};

export const apiMiddleWares = [
	auth.middleware,

	...globalApiMiddleWares,
	...theoryApiMiddleWares,
	...questionsApiMiddleWares,
];
