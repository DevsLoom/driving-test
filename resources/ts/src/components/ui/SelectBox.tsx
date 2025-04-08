import { Select, SelectProps } from "@mantine/core";
import { FC } from "react";

type IProps = SelectProps;

const SelectBox: FC<IProps> = ({ ...props }) => {
  return (
    <Select
      searchable
      clearable
      styles={() => ({
        label: {
          fontWeight: 500,
        },
      })}
      {...props}
    />
  );
};

export default SelectBox;
