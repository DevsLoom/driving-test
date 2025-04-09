import { BackgroundImage, Card, Center, Container } from "@mantine/core";
import { FC, ReactNode } from "react";
import Meta from "../components/Meta";

const Auth: FC<{ children: ReactNode; title: string }> = ({
    children,
    title,
}) => {
    return (
        <>
            <Meta title={title} />
            <BackgroundImage
                src="https://www.shutterstock.com/shutterstock/photos/2194600585/display_1500/stock-vector-concept-poster-for-driving-school-in-d-realistic-style-with-car-traffic-cones-and-traffic-lights-2194600585.jpg"
                w="100%"
                h="100vh"
            >
                <Center h="100%">
                    <Container w="100%" size="xs" p={0}>
                        <Card>{children}</Card>
                    </Container>
                </Center>
            </BackgroundImage>
        </>
    );
};

export default Auth;
