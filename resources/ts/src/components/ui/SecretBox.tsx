import { PasswordInput, PasswordInputProps } from "@mantine/core";
import { FC } from "react";

const SecretBox: FC<PasswordInputProps> = ({ ...props }) => {
  return (
    <PasswordInput
      styles={() => ({
        label: {
          fontWeight: 500,
        },
      })}
      {...props}
    />
  );
};

export default SecretBox;
