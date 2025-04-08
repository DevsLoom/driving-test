import { Modal } from "@mantine/core";
import { FC, ReactNode } from "react";

const AppDialog: FC<{
  opened: boolean;
  close: () => void;
  children: ReactNode;
  title: string;
  size?: string | number;
}> = ({ opened = false, close = () => {}, title, size = "lg", children }) => {
  return (
    <Modal
      opened={opened}
      withCloseButton
      onClose={close}
      size={size}
      radius="md"
      title={title}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 4,
      }}
    >
      {children}
    </Modal>
  );
};

export default AppDialog;
