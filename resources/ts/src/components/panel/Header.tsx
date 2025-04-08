import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, Box, Flex, Group, Indicator, Menu, Text } from "@mantine/core";
const Header = () => {
    return (
        <Box w="100%" h="100%">
            <Flex h="100%" align="center">
                <Menu
                    trigger="hover"
                    offset={16}
                    withArrow
                    position="bottom-end"
                >
                    <Menu.Target>
                        <Group ml="auto">
                            <Indicator color="green" offset={5} withBorder>
                                <Avatar />
                            </Indicator>
                            <Box ta="end">
                                <Text size="sm" fw={600}>
                                    Mr. John Doe
                                </Text>
                                <Text size="xs" fw={500} c="dimmed">
                                    john@gmail.com
                                </Text>
                            </Box>
                        </Group>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Account</Menu.Label>
                        <Menu.Item
                            leftSection={
                                <Icon
                                    icon="carbon:user-profile"
                                    fontSize={18}
                                />
                            }
                        >
                            My Account
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                            color="pink"
                            leftSection={<Icon icon="solar:logout-2-outline" />}
                        >
                            Log Out
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Flex>
        </Box>
    );
};

export default Header;
