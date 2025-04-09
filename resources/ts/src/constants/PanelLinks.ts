

export const PANEL_LINKS = [
    {
        label: "Analytics",
        items: [
            { label: "Dashboard", icon: "radix-icons:dashboard", path: "/admin/dashboard", items: [] },
        ],
    },
    {
        label: "Manage",
        items: [
            {
                label: "Tests",
                icon: "qlementine-icons:test-16",
                path: "/admin/tests",
                items: [],
            },
            {
                label: "Questions",
                icon: "bi:question-circle",
                path: null,
                items: [
                    { label: "List", icon: "", path: "/test", items: [] },
                    { label: "Categories", icon: "", path: "/admin/question-manage/categories", items: [] },
                ],
            },
        ],
    },
    {
        label: "Administration",
        items: [
            {
                label: "Role Management",
                icon: "healthicons:i-exam-multiple-choice-outline",
                path: null,
                items: [
                    { label: "Employees", icon: "", path: "/test", items: [] },
                    { label: "Roles", icon: "", path: "/test", items: [] },
                ],
            },
        ],
    },
]