import { Icon } from "@iconify/react/dist/iconify.js";
import { TextInput, TextInputProps } from "@mantine/core";
import { FC } from "react";

const SearchBox: FC<TextInputProps> = ({ ...props }) => {
    return (
        <TextInput
            rightSection={<Icon icon="ic:round-search" fontSize={20} />}
            placeholder="Search..."
            {...props}
            type="search"
        />
    );
};

export default SearchBox;
