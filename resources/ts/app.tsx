import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import ThemeProvider from "./src/theme";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./src/pages/**/*.tsx");
        return pages[`./src/pages/${name}.tsx`]();
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>,
        );
    },
    progress: {
        delay: 250,
        color: "#29b",
        includeCSS: true,
        showSpinner: true,
    },
});
