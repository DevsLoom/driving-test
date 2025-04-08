import { TextInput, TextInputProps } from "@mantine/core";
import { FC } from "react";

const TextBox: FC<TextInputProps> = ({ ...props }) => {
    return (
        <TextInput
            styles={() => ({
                label: {
                    fontWeight: 500,
                },
            })}
            {...props}
        />
    );
};

export default TextBox;
