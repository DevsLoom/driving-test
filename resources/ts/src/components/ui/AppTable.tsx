import { Box, Card, Table, TableScrollContainer, Text } from "@mantine/core";
import { FC, ReactNode } from "react";
import AppBar from "./AppBar";

const AppTable: FC<{
    title?: string;
    action?: ReactNode;
    breadcrumbs?: ReactNode;
    headers?: { field: string; align: string; w: number }[];
    rows?: ReactNode;
    loading?: boolean;
    found?: boolean;
}> = ({
    title,
    action,
    breadcrumbs,
    headers = [],
    rows,
    loading = false,
    found = false,
}) => {
    return (
        <>
            <AppBar title={title} action={breadcrumbs} />
            {action && <Box py="lg">{action}</Box>}
            <Card withBorder p={0}>
                <TableScrollContainer minWidth={500}>
                    <Table
                        verticalSpacing="md"
                        horizontalSpacing="lg"
                        striped
                        highlightOnHover
                    >
                        <Table.Thead>
                            <Table.Tr>
                                {headers?.map((item, i) => (
                                    <Table.Td
                                        miw={item?.w}
                                        align={
                                            item?.align as
                                                | "center"
                                                | "left"
                                                | "right"
                                                | "justify"
                                                | "char"
                                                | undefined
                                        }
                                        key={i}
                                        fw={600}
                                        className="!text-dark"
                                    >
                                        {item?.field}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {rows}
                            {/* {loading && (
                <Table.Tr>
                  <Table.Td colSpan={headers?.length || 1} align="center">
                    <Loader color="primary.9" />
                  </Table.Td>
                </Table.Tr>
              )} */}
                            {!loading && !found && (
                                <Table.Tr>
                                    <Table.Td colSpan={headers?.length || 1}>
                                        <Text c="dimmed" pt="xs" ta="center">
                                            No data available at the moment.
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </TableScrollContainer>
            </Card>
        </>
    );
};

export default AppTable;
