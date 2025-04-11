import { Icon } from "@iconify/react/dist/iconify.js";
import { router } from "@inertiajs/react";
import { Avatar, Box, Flex, Group, Indicator, Menu, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { alertMessage, imageUrlBuilder } from "~/src/lib/helpers";
import { RootState } from "~/src/store";
import { useLogoutMutation } from "~/src/store/actions/slices/auth";
import { clearCurrentUser } from "~/src/store/reducers/auth";
const Header = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: RootState) => state.auth);

    const [logout] = useLogoutMutation();
    const logoutHandler = async () => {
        await logout("")
            .unwrap()
            .then((res) => {
                if (res.status === "success") {
                    dispatch(clearCurrentUser());
                    Cookies.remove("_secret");
                    router.visit("/login", { replace: true });
                    notifications.show({
                        position: "top-right",
                        withCloseButton: true,
                        autoClose: 5000,
                        title: "Success",
                        message: res.message,
                        color: "green",
                    });
                }
            })
            .catch((err) =>
                alertMessage({
                    title: err.message,
                    icon: "error",
                    timer: 2000,
                }),
            );
    };

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
                                <Avatar
                                    src={imageUrlBuilder(currentUser?.avatar)}
                                />
                            </Indicator>
                            <Box ta="end">
                                <Text size="sm" fw={600}>
                                    {`${currentUser?.first_name || ""} ${
                                        currentUser?.last_name || ""
                                    }`}
                                </Text>
                                <Text size="xs" fz={12} c="dimmed">
                                    {currentUser?.role?.name}
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
                            onClick={logoutHandler}
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
