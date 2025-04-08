import { NumberInput, NumberInputProps } from "@mantine/core";
import { FC } from "react";

const NumberBox: FC<NumberInputProps> = ({ ...props }) => {
  return (
    <NumberInput
      styles={() => ({
        label: {
          fontWeight: 500,
        },
      })}
      {...props}
    />
  );
};

export default NumberBox;
