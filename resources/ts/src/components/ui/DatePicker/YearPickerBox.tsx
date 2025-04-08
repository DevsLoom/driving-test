import { YearPickerInput, YearPickerInputProps } from "@mantine/dates";
import { FC } from "react";

const YearPickerBox: FC<YearPickerInputProps & { onChange?: () => void }> = ({
  onChange,
  ...props
}) => {
  return (
    <YearPickerInput
      onChange={onChange}
      styles={() => ({
        label: {
          fontWeight: 500,
        },
      })}
      {...props}
    />
  );
};

export default YearPickerBox;
