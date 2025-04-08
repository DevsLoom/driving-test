import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { FC } from "react";

type IProps = MultiSelectProps;

const MultiSelectBox: FC<IProps> = ({ ...props }) => {
  return (
    <MultiSelect
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

export default MultiSelectBox;
