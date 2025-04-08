import tags from "./tags";

export const globalApiReducers = {
    [tags.reducerPath]: tags.reducer,
};
export const globalApiMiddleWares = [
    tags.middleware,
];