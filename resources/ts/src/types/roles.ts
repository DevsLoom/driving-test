export type RoleType = {
    id: string;
    name: string;
    status: string;
};

export type RoleFormType = {
    name: string;
    grant_permission: boolean;
    permissions: string[];
    status: string;
};
