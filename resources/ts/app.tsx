import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./src/store";
import ThemeProvider from "./src/theme";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./src/pages/**/*.tsx");
        return pages[`./src/pages/${name}.tsx`]();
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <Provider store={store}>
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>
            </Provider>,
        );
    },
    progress: {
        delay: 250,
        color: "#29b",
        includeCSS: true,
        showSpinner: true,
    },
});
