import { TagsInput, TagsInputProps } from "@mantine/core";
import { FC } from "react";

const TagBox: FC<TagsInputProps> = ({ ...props }) => {
  return (
    <TagsInput
      styles={() => ({
        label: {
          fontWeight: 500,
        },
      })}
      {...props}
    />
  );
};

export default TagBox;
