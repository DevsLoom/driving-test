import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "@inertiajs/react";
import {
    ActionIcon,
    Button,
    Flex,
    Group,
    Image,
    Table,
    Text,
    Tooltip,
} from "@mantine/core";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import TestForm from "~/src/components/panel/pages/Tests/Form";
import AppDialog from "~/src/components/ui/AppDialog";
import AppTable from "~/src/components/ui/AppTable";
import SearchBox from "~/src/components/ui/SearchBox";
import Panel from "~/src/layouts/Panel";
import {
    alertMessage,
    deleteAlertMessage,
    imageUrlBuilder,
} from "~/src/lib/helpers";
import {
    useDeleteTestMutation,
    useFetchTestQuery,
    useFetchTestsQuery,
} from "~/src/store/actions/slices/theory/tests";
import { TestType } from "~/src/types/theory/tests";

const headers = [
    { field: "SL.", align: "left", w: 60 },
    { field: "Name", align: "left", w: 300 },
    { field: "Opt.", align: "center", w: 120 },
];

const TestList = () => {
    const [items, setItems] = useState<TestType[]>([]);
    const [params, setParams] = useState({ offset: 0, limit: 10, search: "" });
    const [hasMore, setHasMore] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [opened, { open, close }] = useDisclosure(false);

    const searchHandler = useDebouncedCallback((query: string) => {
        setParams((prev) => ({ ...prev, offset: 0, search: query }));
        setItems([]);
    }, 800);

    const { data, isFetching } = useFetchTestsQuery(
        `fields=id,name,image,position&limit=${params.limit}&offset=${params.offset}${
            params.search ? `&search=${params.search}` : ""
        }`,
    );

    const {
        data: payload,
        isFetching: isPayloadFetching,
        isUninitialized,
    } = useFetchTestQuery(selectedId, {
        skip: !selectedId,
        refetchOnMountOrArgChange: true,
    });

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

    const closeHandler = () => {
        setSelectedId(null);
        close();
    };

    const [deleteItem, result] = useDeleteTestMutation();
    const deleteHandler = async (id: string) => {
        deleteAlertMessage(async () => {
            await deleteItem(id)
                .unwrap()
                .then((res) => {
                    setItems((prevItems) =>
                        prevItems.filter((item) => item.id !== id),
                    );
                    notifications.show({
                        position: "top-right",
                        withCloseButton: true,
                        autoClose: 2500,
                        title: "Success",
                        message: res.message,
                        color: "green",
                    });
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
        <>
            <AppDialog
                title={`${!isUninitialized && selectedId ? "Update" : "Add"} Test`}
                opened={opened}
                close={closeHandler}
            >
                <TestForm
                    loading={isPayloadFetching}
                    close={closeHandler}
                    payload={!isUninitialized ? payload : null}
                    setItems={setItems}
                />
            </AppDialog>
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
                            <Table.Td>{item?.position}</Table.Td>
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
                                            onClick={() =>
                                                deleteHandler(item?.id)
                                            }
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
        </>
    );
};

TestList.layout = (page: any) => <Panel children={page} title="Tests" />;
export default TestList;
