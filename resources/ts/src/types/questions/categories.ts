export type QuestionCategoryType = {
    id: string;
    name: string;
    image: string | null;
    position: number;
};

export type QuestionCategoryFormType = {
    name: string;
    image: string;
    status: string;
};
