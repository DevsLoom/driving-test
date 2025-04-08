import { Center, Loader } from "@mantine/core";
import { FC } from "react";

const AppLoader: FC<{ w?: string | number; h?: string | number }> = ({
    w = "100%",
    h = "100%",
}) => {
    return (
        <Center w={w} h={h}>
            <Loader />
        </Center>
    );
};

export default AppLoader;
