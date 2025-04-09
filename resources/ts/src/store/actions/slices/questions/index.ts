import questionCategories from "./categories";
import questions from "./questions";

export const questionsApiReducers = {
    [questionCategories.reducerPath]: questionCategories.reducer,
    [questions.reducerPath]: questions.reducer,
};
export const questionsApiMiddleWares = [
    questionCategories.middleware,
    questions.middleware,
];