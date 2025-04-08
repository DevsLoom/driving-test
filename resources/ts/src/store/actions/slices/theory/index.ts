import questions from "./questions";
import tests from "./tests";

export const theoryApiReducers = {
    [tests.reducerPath]: tests.reducer,
    [questions.reducerPath]: questions.reducer,
};
export const theoryApiMiddleWares = [
    tests.middleware,
    questions.middleware,
];