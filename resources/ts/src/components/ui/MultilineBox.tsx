import { Textarea, TextareaProps } from "@mantine/core";
import { FC } from "react";

const MultilineBox: FC<TextareaProps> = ({ ...props }) => {
  return (
    <Textarea
      radius="xl"
      styles={() => ({
        label: {
          fontWeight: 500,
        },
      })}
      {...props}
    />
  );
};

export default MultilineBox;
