import { usePage } from "@inertiajs/react";
import { Badge, Card, Group, Image, Stack, Table } from "@mantine/core";
import dayjs from "dayjs";
import QuestionList from "~/src/components/panel/pages/Tests/QuestionList";
import AppLoader from "~/src/components/ui/AppLoader";
import Panel from "~/src/layouts/Panel";
import { imageUrlBuilder } from "~/src/lib/helpers";
import { useFetchTestQuery } from "~/src/store/actions/slices/theory/tests";

const TestShow = () => {
    const { props } = usePage();

    const { data, isFetching } = useFetchTestQuery(
        `${props.id}?fields=id,name,image,tags,status,created_at,updated_at`,
        {
            skip: !props.id,
            refetchOnMountOrArgChange: true,
        },
    );

    return (
        <Stack>
            <Card>
                {isFetching ? (
                    <AppLoader h="400px" />
                ) : (
                    <Table variant="vertical" layout="fixed" withTableBorder>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th w={160}>Name</Table.Th>
                                <Table.Td>{data?.name || "-"}</Table.Td>
                                <Table.Td rowSpan={4} width={250}>
                                    <Image
                                        src={imageUrlBuilder(data?.image || "")}
                                        w={200}
                                        h={200}
                                        mx="auto"
                                    />
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Tags</Table.Th>
                                <Table.Td>
                                    <Group>
                                        {data?.tags?.length
                                            ? data?.tags?.map(
                                                  (item: string, i: number) => (
                                                      <Badge
                                                          key={i}
                                                          size="sm"
                                                          variant="light"
                                                          radius="xs"
                                                      >
                                                          {item}
                                                      </Badge>
                                                  ),
                                              )
                                            : "-"}
                                    </Group>
                                </Table.Td>
                            </Table.Tr>

                            <Table.Tr>
                                <Table.Th>Status</Table.Th>
                                <Table.Td>
                                    <Badge size="sm" variant="dot">
                                        {data?.status}
                                    </Badge>
                                </Table.Td>
                            </Table.Tr>

                            <Table.Tr>
                                <Table.Th>Total Questions</Table.Th>
                                <Table.Td>0</Table.Td>
                            </Table.Tr>

                            <Table.Tr>
                                <Table.Th>Created at</Table.Th>
                                <Table.Td>
                                    {dayjs(data?.created_at).format(
                                        "MMMM DD, YYYY hh:mm A",
                                    )}
                                </Table.Td>
                            </Table.Tr>

                            <Table.Tr>
                                <Table.Th>Last updated at</Table.Th>
                                <Table.Td>
                                    {dayjs(data?.updated_at).format(
                                        "MMMM DD, YYYY hh:mm A",
                                    )}
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                )}
            </Card>

            <QuestionList test_id={props.id} />
        </Stack>
    );
};

TestShow.layout = (page: any) => <Panel children={page} title="Test" />;
export default TestShow;
