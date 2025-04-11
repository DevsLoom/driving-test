export type UserType = {
    id: string;
    type: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar: string;
    status: string;
    role: {id: number, name: string}
};

export type UserFormType = {
    type: string;
    role_id: string;
    company_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar: string;
    password: string;
    status: string;
};