import { DatePickerInput, DatePickerInputProps } from "@mantine/dates";
import { FC } from "react";

const DatePickerBox: FC<DatePickerInputProps & { onChange?: () => void }> = ({
  onChange,
  ...props
}) => {
  return (
    <DatePickerInput
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

export default DatePickerBox;
