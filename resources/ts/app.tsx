import { createInertiaApp } from "@inertiajs/react";
import Cookies from "js-cookie";
import { FC, ReactNode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import tokenDecoder from "./src/lib/jwt";
import store from "./src/store";
import { setCurrentUser } from "./src/store/reducers/auth";
import ThemeProvider from "./src/theme";

const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = Cookies.get("_secret") || null;
        if (token) {
            const { myDecodedToken, isMyTokenExpired } = tokenDecoder(token);
            dispatch(
                setCurrentUser({
                    token: token,
                    currentUser: myDecodedToken,
                    isTokenExpire: isMyTokenExpired,
                    isAuthenticate: true,
                }),
            );
        }
    }, []);
    return children;
};

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./src/pages/**/*.tsx");
        return pages[`./src/pages/${name}.tsx`]();
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <Provider store={store}>
                <AppProvider>
                    <ThemeProvider>
                        <App {...props} />
                    </ThemeProvider>
                </AppProvider>
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
