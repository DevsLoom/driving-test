import auth from './slices/auth';
import { globalApiMiddleWares, globalApiReducers } from './slices/global';
import { theoryApiMiddleWares, theoryApiReducers } from './slices/theory';

export const apiReducers = {
	[auth.reducerPath]: auth.reducer,
    
	...globalApiReducers,
	...theoryApiReducers,
};

export const apiMiddleWares = [
	auth.middleware,

	...globalApiMiddleWares,
	...theoryApiMiddleWares,
];
