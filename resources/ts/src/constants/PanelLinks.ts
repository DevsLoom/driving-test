

export const PANEL_LINKS = [
    {
        label: "Analytics",
        items: [
            { label: "Dashboard", icon: "si:dashboard-line", path: "/admin/dashboard", items: [] },
        ],
    },
    {
        label: "Manage",
        items: [
            {
                label: "Tests",
                icon: "healthicons:i-exam-multiple-choice-outline",
                path: "/admin/tests",
                items: [],
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