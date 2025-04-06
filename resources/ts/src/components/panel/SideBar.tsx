import { Box, NavLink, Stack, Text } from "@mantine/core";

const data = [
    {
        label: "Analytics",
        items: [
            { label: "Dashboard", icon: "", path: "/dashboard", items: [] },
        ],
    },
    {
        label: "Apps",
        items: [
            {
                label: "Test Management",
                icon: "",
                path: null,
                items: [
                    { label: "Tests", icon: "", path: "/test", items: [] },
                    {
                        label: "Questions Management",
                        icon: "",
                        path: null,
                        items: [
                            {
                                label: "Category",
                                icon: "",
                                path: "/test",
                                items: [],
                            },
                            {
                                label: "Question",
                                icon: "",
                                path: "/test",
                                items: [],
                            },
                        ],
                    },
                ],
            },
            {
                label: "Posts",
                icon: "",
                path: "/posts",
                items: [],
            },
        ],
    },
];

const SideBar = () => {
    return (
        <Box pt={40}>
            <Stack>
                {data?.map((item, i) => (
                    <Box>
                        <Text size="xs" c="dimmed" pos="relative" className="before:absolute before:w-full before:h-2;',jmhjpjkl;j                                                                                                                                                                                                                        ">
                            Apps & Pages
                        </Text>
                        <NavLink
                            href="#required-for-focus"
                            label="First parent link"
                            // leftSection={<IconGauge size={16} stroke={1.5} />}
                            childrenOffset={28}
                        >
                            <NavLink
                                href="#required-for-focus"
                                label="First child link"
                            />
                            <NavLink
                                label="Second child link"
                                href="#required-for-focus"
                            />
                            <NavLink
                                label="Nested parent link"
                                childrenOffset={28}
                                href="#required-for-focus"
                            >
                                <NavLink
                                    label="First child link"
                                    href="#required-for-focus"
                                />
                                <NavLink
                                    label="Second child link"
                                    href="#required-for-focus"
                                />
                                <NavLink
                                    label="Third child link"
                                    href="#required-for-focus"
                                />
                            </NavLink>
                        </NavLink>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default SideBar;
