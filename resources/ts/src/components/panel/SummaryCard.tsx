import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Box,
  Card,
  Group,
  NumberFormatter,
  Skeleton,
  Text,
} from "@mantine/core";
import { FC } from "react";

const SummaryCard: FC<{
  label?: string;
  value?: number;
  bg?: string;
  c?: string;
  icon: string;
  loading?: boolean;
}> = ({ label, value, bg, c, icon, loading = false }) => {
  if (loading) {
    return (
      <Card withBorder shadow="sm" p="xl" radius="lg">
        <Group gap="lg">
          <Skeleton w={60} h={60} circle />
          <Box>
            <Skeleton w={100} h={20} mb="xs" />
            <Skeleton w={120} h={20} />
          </Box>
        </Group>
      </Card>
    );
  }
  return (
    <Card withBorder shadow="sm" p="xl" radius="lg">
      <Group gap="lg">
        <Box bg={bg} c={c} className="rounded-full" p="xs">
          <Icon icon={icon} fontSize={40} />
        </Box>
        <Box>
          <Text fz={22} fw={600}>
            <NumberFormatter value={value} thousandSeparator />
          </Text>
          <Text c="dimmed" fz={16}>
            {label}
          </Text>
        </Box>
      </Group>
    </Card>
  );
};

export default SummaryCard;
