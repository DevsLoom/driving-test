import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "@inertiajs/react";
import { ActionIcon, Button, Flex, Group, Table, Tooltip } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { FC, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import AppTable from "~/src/components/ui/AppTable";
import SearchBox from "~/src/components/ui/SearchBox";
import { alertMessage, deleteAlertMessage } from "~/src/lib/helpers";
import {
    useDeleteQuestionMutation,
    useFetchQuestionsQuery,
} from "~/src/store/actions/slices/theory/questions";
import { QuestionType } from "~/src/types/theory/questions";

const headers = [
    { field: "SL.", align: "left", w: 60 },
    { field: "Title", align: "left", w: 300 },
    { field: "Opt.", align: "center", w: 120 },
];

const QuestionList: FC<{ test_id: string }> = ({ test_id }) => {
    const [items, setItems] = useState<QuestionType[]>([]);
    const [params, setParams] = useState({ offset: 0, limit: 10, search: "" });
    const [hasMore, setHasMore] = useState(true);

    const searchHandler = useDebouncedCallback((query: string) => {
        setParams((prev) => ({ ...prev, offset: 0, search: query }));
        setItems([]);
    }, 800);

    const { data, isFetching } = useFetchQuestionsQuery(
        `test_id=${test_id}&limit=${params.limit}&offset=${params.offset}${
            params.search ? `&search=${params.search}` : ""
        }`,
    );

    useEffect(() => {
        if (data && data.length) {
            const mergeData = (
                prevItems: QuestionType[],
                newItems: QuestionType[],
            ): QuestionType[] => {
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

    const [deleteItem, result] = useDeleteQuestionMutation();
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
        <InfiniteScroll
            dataLength={items.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader=""
            endMessage=""
            scrollThreshold={0.9}
        >
            <AppTable
                title="Questions"
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
                            component={Link}
                            href={`/admin/tests/${test_id}/questions/create`}
                            disabled={isFetching || result.isLoading}
                        >
                            Add New
                        </Button>
                    </Group>
                }
                rows={items?.map((item, i) => (
                    <Table.Tr key={i}>
                        <Table.Td>{item?.position}</Table.Td>
                        <Table.Td>{item?.title}</Table.Td>
                        <Table.Td>
                            <Flex justify="center">
                                <Tooltip label="Edit" withArrow>
                                    <ActionIcon
                                        radius="xl"
                                        color="blue"
                                        variant="subtle"
                                        component={Link}
                                        href={`/admin/tests/${test_id}/questions/${item?.id}/edit`}
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

export default QuestionList;
