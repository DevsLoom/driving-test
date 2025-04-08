import { Card, Grid, Text } from "@mantine/core";
import { FC, ReactNode } from "react";

const AppBar: FC<{ title?: string; action?: ReactNode }> = ({
    title,
    action,
}) => {
    return (
        <Card withBorder>
            <Grid align="center">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    {title ? (
                        <Text fz={20} fw={600} className="!text-dark">
                            {title}
                        </Text>
                    ) : (
                        ""
                    )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>{action}</Grid.Col>
            </Grid>
        </Card>
    );
};

export default AppBar;
