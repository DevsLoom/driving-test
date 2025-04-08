import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, ReactNode } from "react";
import Meta from "../components/Meta";
import Header from "../components/panel/Header";
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
                layout="alt"
                header={{ height: 60 }}
                navbar={{
                    width: 260,
                    breakpoint: "md",
                    collapsed: { mobile: opened },
                }}
                bg="#F9FAFB"
                p="lg"
            >
                <AppShell.Header p="lg">
                    <Header />
                </AppShell.Header>
                <AppShell.Navbar>
                    <SideBar />
                </AppShell.Navbar>
                <AppShell.Main>{children}</AppShell.Main>
            </AppShell>
        </>
    );
};

export default Panel;
