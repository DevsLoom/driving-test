import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { FC, ReactNode } from "react";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

const theme = createTheme({
    fontFamily: `Roboto, sans-serif`,
    fontSmoothing: true,
});
const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications />
            {children}
        </MantineProvider>
    );
};

export default ThemeProvider;
