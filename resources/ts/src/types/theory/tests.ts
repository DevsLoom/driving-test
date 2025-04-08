export type TestType = {
    id: string;
    name: string;
    image: string | null;
    tags: string[];
    position: number;
};

export type TestFormType = {
    name: string;
    image: string;
    tags: string[];
    status: string;
};
