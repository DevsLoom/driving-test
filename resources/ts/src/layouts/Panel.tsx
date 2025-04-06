import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, ReactNode } from "react";
import Meta from "../components/Meta";
import SideBar from "../components/panel/SideBar";

const Panel: FC<{ children: ReactNode; title?: string }> = ({
    title,
    children,
}) => {
    const [opened, { toggle }] = useDisclosure();
    return (
        <>
            <Meta title={title} />
            <AppShell
                // header={{ height: 60 }}
                navbar={{
                    width: 250,
                    breakpoint: "sm",
                    collapsed: { mobile: !opened },
                }}
                p="lg"
                bg="#F4F5FA"
                withBorder={false}
            >
                {/* <AppShell.Header><Header /></AppShell.Header> */}
                <AppShell.Navbar>
                    <SideBar />
                </AppShell.Navbar>
                <AppShell.Main>{children}</AppShell.Main>
            </AppShell>
        </>
    );
};

export default Panel;
