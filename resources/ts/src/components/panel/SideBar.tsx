import { Icon } from "@iconify/react";
import { Link, usePage } from "@inertiajs/react";
import {
    ActionIcon,
    Anchor,
    Box,
    Group,
    Image,
    NavLink,
    ScrollArea,
    Stack,
    Text,
} from "@mantine/core";
import { PANEL_LINKS } from "~/src/constants/PanelLinks";
type NavItem = {
    label: string;
    path: string | null;
    icon?: string;
    items: NavItem[];
};

const RenderNavItems = (items: NavItem[], link: string) =>
    items.map((item, i) => (
        <NavLink
            key={i}
            label={item?.label}
            href={item?.path || ""}
            childrenOffset={28}
            leftSection={
                item.icon ? <Icon icon={item.icon} fontSize={16} /> : null
            }
            component={Link}
            fw={500}
            active={item?.path === link}
        >
            {item.items?.length > 0 && RenderNavItems(item.items, link)}
        </NavLink>
    ));

const SideBar = () => {
    const { url } = usePage();

    return (
        <Box p="lg">
            <Group justify="space-between" mb="xl">
                <Anchor
                    component={Link}
                    href="/admin/dashboard"
                    underline="never"
                    mx="auto"
                >
                    <Image
                        w="100%"
                        h={48}
                        src="https://placehold.co/600x48?text=LOGO"
                    />
                </Anchor>

                <ActionIcon
                    radius="xl"
                    variant="subtle"
                    size="xl"
                    hiddenFrom="md"
                    color="gray"
                    // onClick={close}
                >
                    <Icon icon="material-symbols:close-rounded" fontSize={22} />
                </ActionIcon>
            </Group>
            <ScrollArea h="calc(100vh - 100px)">
                <Stack pb="xl" gap="lg">
                    {PANEL_LINKS.map((item, i) => (
                        <Box key={i}>
                            <Text
                                fz="0.70rem"
                                fw={500}
                                pl="sm"
                                c="dimmed"
                                className="!tracking-wider"
                                mb={2}
                            >
                                {item?.label}
                            </Text>
                            {RenderNavItems(item?.items, url)}
                        </Box>
                    ))}
                </Stack>
            </ScrollArea>
        </Box>
    );
};

export default SideBar;
