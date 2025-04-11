import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";
import { ActionIcon, Button, Flex, Group, Text, Tooltip } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { alertMessage, deleteAlertMessage } from "~/src/lib/helpers";
import {
    useDeleteRoleMutation,
    useFetchRolesQuery,
} from "~/src/store/actions/slices/roles";

const Roles = () => {
    const [items, setItems] = useState([]);
    const [params, setParams] = useState({ offset: 0, limit: 10, search: "" });
    const [hasMore, setHasMore] = useState(true);

    const { data, isFetching, refetch } = useFetchRolesQuery(
        `page=${params.offset}&offset=${params.limit}${
            params.search ? `&search=${params.search}` : ""
        }`,
    );

    const searchHandler = useDebouncedCallback((query: string) => {
        setParams((prev) => ({ ...prev, offset: 0, search: query }));
        setItems([]);
    }, 800);

    useEffect(() => {
        if (data && data.length) {
            const mergeData = (
                prevItems: TestType[],
                newItems: TestType[],
            ): TestType[] => {
                return [
                    ...prevItems,
                    ...newItems.filter(
                        (newItem) =>
                            !prevItems.some(
                                (prevItem) => prevItem.id === newItem.id,
                            ),
                    ),
                ];
            };
            const payload = mergeData(items, data);
            setItems(payload);
        }

        if (data && data.length < params.limit) {
            setHasMore(false);
        }
    }, [data]);

    const loadMoreData = () => {
        if (!isFetching && hasMore) {
            setParams((prev) => ({
                ...prev,
                offset: prev.offset + prev.limit,
            }));
        }
    };

    const [deleteRole, result] = useDeleteRoleMutation();
    const deleteHandler = async (id: string) => {
        deleteAlertMessage(async () => {
            await deleteRole(id)
                .unwrap()
                .then((res) => {
                    notifications.show({
                        position: "top-right",
                        withCloseButton: true,
                        autoClose: 1500,
                        title: "Success",
                        message: res.message,
                        color: "green",
                    });
                    refetch();
                })
                .catch((err) =>
                    alertMessage({
                        title: err.message,
                        icon: "error",
                        timer: 5000,
                    }),
                );
        });
    };

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader=""
            endMessage=""
            scrollThreshold={0.9}
        >
            <AppTable
                title="Tests"
                headers={headers}
                found={items?.length > 0}
                loading={isFetching}
                action={
                    <Group justify="space-between">
                        <SearchBox
                            onChange={(e) => searchHandler(e.target.value)}
                            disabled={result.isLoading}
                        />
                        <Button
                            leftSection={
                                <Icon
                                    icon="material-symbols:add-rounded"
                                    fontSize={20}
                                />
                            }
                            onClick={open}
                            disabled={isFetching || result.isLoading}
                        >
                            Add New
                        </Button>
                    </Group>
                }
                rows={items?.map((item, i) => (
                    <Table.Tr key={i}>
                        <Table.Td>{i + 1}</Table.Td>
                        <Table.Td>
                            <Group>
                                <Image
                                    w={40}
                                    h={40}
                                    src={imageUrlBuilder(item?.image)}
                                />
                                <Text size="sm">{item?.name}</Text>
                            </Group>
                        </Table.Td>
                        <Table.Td>
                            <Flex justify="center">
                                <Tooltip label="View" withArrow>
                                    <ActionIcon
                                        radius="xl"
                                        color="gray"
                                        variant="subtle"
                                        component={Link}
                                        href={`/admin/tests/${item?.id}/show`}
                                        disabled={result.isLoading}
                                    >
                                        <Icon icon="lets-icons:view" />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Edit" withArrow>
                                    <ActionIcon
                                        radius="xl"
                                        color="blue"
                                        variant="subtle"
                                        onClick={() => {
                                            setSelectedId(item?.id);
                                            open();
                                        }}
                                        disabled={result.isLoading}
                                    >
                                        <Icon icon="cuida:edit-outline" />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Delete" withArrow>
                                    <ActionIcon
                                        radius="xl"
                                        color="pink"
                                        variant="subtle"
                                        onClick={() => deleteHandler(item?.id)}
                                        loading={result.isLoading}
                                    >
                                        <Icon icon="fluent:delete-20-regular" />
                                    </ActionIcon>
                                </Tooltip>
                            </Flex>
                        </Table.Td>
                    </Table.Tr>
                ))}
            />
        </InfiniteScroll>
    );
};

Roles.layout = (page: any) => (
    <Backend children={page} title="Role | Job Journey" />
);
export default Roles;
