import { Head } from "@inertiajs/react";
import { FC } from "react";

const Meta: FC<{ title?: string; favicon?: string }> = ({
    title = "",
    favicon = "",
}) => {
    return (
        <Head>
            <title>{`${title} | Driving Test`}</title>
            <link rel="icon" type="image/svg+xml" href={favicon} />
        </Head>
    );
};

export default Meta;
