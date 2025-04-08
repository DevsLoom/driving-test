import { Checkbox, CheckboxProps } from "@mantine/core";
import { FC } from "react";

const CheckBox: FC<CheckboxProps> = ({ ...props }) => {
  return (
    <Checkbox
      styles={() => ({
        label: {
          fontWeight: 500,
        },
      })}
      {...props}
    />
  );
};

export default CheckBox;
