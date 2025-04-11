import { QuestionCategoryType } from "./categories";

export type QuestionType = {
	id: string;
	category_id: string;
	category: QuestionCategoryType;
	title: string;
	options: {
        id: string;
        title: string;
    }[];
    question_correct_option: {
        id: string;
        question_id: string;
        option_id: string;
    };
    explanations: {
        id: string;
        question_id: string;
        language: string;
        explanation: string;
    }[];
    tags: string[];
    position: number;
    status: string
};

export type QuestionFormType = {
	question_category_id: string;
    title: string;
    tags: string[];
    options: {
        title: string;
        is_correct: boolean;
    }[];
    explanations: {
        language: string;
        explanation: string;
    }[];
    image: string,
    video_url: string,
    status: string;
};