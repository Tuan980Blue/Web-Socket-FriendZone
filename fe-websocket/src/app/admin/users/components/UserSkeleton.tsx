import { Group, Stack, Skeleton } from "@mantine/core";

const UserSkeleton = () => {
  return (
    <Stack gap="md">
      {/* Stats Skeleton */}
      <Group grow>
        <Skeleton height={80} radius="md" />
        <Skeleton height={80} radius="md" />
        <Skeleton height={80} radius="md" />
      </Group>

      {/* Filters Skeleton */}
      <Group justify="space-between">
        <Group>
          <Skeleton height={36} width={256} radius="md" />
          <Skeleton height={36} width={120} radius="md" />
        </Group>
        <Group>
          <Skeleton height={36} width={80} radius="md" />
        </Group>
      </Group>

      {/* Table Skeleton */}
      <Stack gap="xs">
        <Skeleton height={50} radius="md" />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} height={60} radius="md" />
        ))}
      </Stack>

      {/* Pagination Skeleton */}
      <Skeleton height={40} width={200} radius="md" />
    </Stack>
  );
};

export default UserSkeleton; 