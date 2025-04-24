import React, {useState} from 'react';
import {User} from '@/services/adminService';
import {
    Table,
    Group,
    Text,
    Avatar,
    Badge,
    ActionIcon,
    Menu,
    Tooltip,
    ScrollArea,
    ThemeIcon,
    Paper,
    Stack
} from '@mantine/core';
import {
    IconDots,
    IconEdit,
    IconTrash,
    IconBan,
    IconUserCheck,
    IconEye,
    IconMail,
    IconUser,
    IconCircleCheck,
    IconCircleX,
    IconCopy,
    IconShield,
    IconClock,
    IconSettings
} from '@tabler/icons-react';
import {format} from 'date-fns';
import {notifications} from '@mantine/notifications';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onToggleBan: (user: User, ban: boolean) => void;
    onViewDetails: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
                                                 users,
                                                 onEdit,
                                                 onDelete,
                                                 onToggleBan,
                                                 onViewDetails
                                             }) => {
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    const handleCopyEmail = (email: string) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        notifications.show({
            title: 'Success',
            message: 'Email copied to clipboard',
            color: 'green',
        });
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    const rows = users.map((user) => (
        <Table.Tr key={user.id} className="hover:bg-gray-50 transition-colors">
            <Table.Td>
                <Group gap="sm">
                    <Avatar
                        src={user.avatar}
                        size={40}
                        radius={40}
                        color={user.isBanned ? 'red' : 'blue'}
                        className="border-2 border-gray-100"
                    >
                        {user.fullName?.charAt(0) || user.username.charAt(0)}
                    </Avatar>
                    <Stack gap={2}>
                        <Text fw={600} fz="sm" className="text-gray-800">
                            {user.fullName || user.username}
                        </Text>
                        <Text fz="xs" c="dimmed" className="text-gray-500">
                            @{user.username}
                        </Text>
                    </Stack>
                </Group>
            </Table.Td>
            <Table.Td>
                <Group gap={4}>
                    <Text fz="sm" className="text-gray-700">{user.email}</Text>
                    <Tooltip
                        label={copiedEmail === user.email ? "Copied!" : "Copy email"}
                        color={copiedEmail === user.email ? "green" : "gray"}
                        withArrow
                    >
                        <ActionIcon
                            variant="default"
                            color={copiedEmail === user.email ? "green" : "gray"}
                            size="xs"
                            onClick={() => handleCopyEmail(user.email)}
                        >
                            <IconCopy size={14}/>
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Table.Td>
            <Table.Td>
                <Badge
                    variant="filled"
                    size="sm"
                    className="capitalize font-medium"
                    color={
                        user.role === 'USER' ? 'blue' :
                            user.role === 'ADMIN' ? 'violet' :
                                'gray'
                    }
                >
                    {user.role}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Badge
                    color={user.isBanned ? "red" : "green"}
                    variant="filled"
                    size="sm"
                    leftSection={
                        <ThemeIcon size="xs" color="white" variant="transparent">
                            {user.isBanned ? <IconCircleX size={12}/> : <IconCircleCheck size={12}/>}
                        </ThemeIcon>
                    }
                    className="font-medium"
                >
                    {user.isBanned ? "Banned" : "Active"}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Text fz="sm" className="text-gray-700">
                    {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                </Text>
            </Table.Td>
            <Table.Td>
                <Group gap={6} justify="center">
                    <Tooltip label="View Details" withArrow>
                        <ActionIcon
                            variant="filled"
                            color="blue"
                            onClick={() => onViewDetails(user)}
                            className="hover:bg-blue-600"
                        >
                            <IconEye size="1rem" stroke={1.5}/>
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Edit User" withArrow>
                        <ActionIcon
                            variant="filled"
                            color="red"
                            onClick={() => onEdit(user)}
                            className="hover:bg-red-600"
                        >
                            <IconEdit size="1rem" stroke={1.5}/>
                        </ActionIcon>
                    </Tooltip>
                    <Menu withArrow position="bottom-end" shadow="md" width={200}>
                        <Menu.Target>
                            <Tooltip label="More" withArrow>
                                <ActionIcon variant="default">
                                    <IconDots size={18}/>
                                </ActionIcon>
                            </Tooltip>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={user.isBanned ?
                                    <IconUserCheck size="1rem" stroke={1.5}/> :
                                    <IconBan size="1rem" stroke={1.5}/>
                                }
                                color={user.isBanned ? "green" : "red"}
                                onClick={() => onToggleBan(user, !user.isBanned)}
                                className="hover:bg-red-50"
                            >
                                {user.isBanned ? 'Unban User' : 'Ban User'}
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item
                                leftSection={<IconTrash size="1rem" stroke={1.5}/>}
                                color="red"
                                onClick={() => onDelete(user)}
                                className="hover:bg-red-50"
                            >
                                Delete User
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Paper shadow="sm" p="md">
            <ScrollArea>
                <Table highlightOnHover>
                    <Table.Thead>
                        <Table.Tr className="bg-gray-50">
                            <Table.Th className="text-gray-700 font-semibold">
                                <Group gap="xs">
                                    <ThemeIcon size="sm" variant="light" color="blue">
                                        <IconUser size={14} />
                                    </ThemeIcon>
                                    <Text>User</Text>
                                </Group>
                            </Table.Th>
                            <Table.Th className="text-gray-700 font-semibold">
                                <Group gap="xs">
                                    <ThemeIcon size="sm" variant="light" color="blue">
                                        <IconMail size={14} />
                                    </ThemeIcon>
                                    <Text>Email</Text>
                                </Group>
                            </Table.Th>
                            <Table.Th className="text-gray-700 font-semibold">
                                <Group gap="xs">
                                    <ThemeIcon size="sm" variant="light" color="blue">
                                        <IconShield size={14} />
                                    </ThemeIcon>
                                    <Text>Role</Text>
                                </Group>
                            </Table.Th>
                            <Table.Th className="text-gray-700 font-semibold">
                                <Group gap="xs" >
                                    <ThemeIcon size="sm" variant="light" color="blue">
                                        <IconCircleCheck size={14} />
                                    </ThemeIcon>
                                    <Text>Status</Text>
                                </Group>
                            </Table.Th>
                            <Table.Th className="text-gray-700 font-semibold">
                                <Group gap="xs" >
                                    <ThemeIcon size="sm" variant="light" color="blue">
                                        <IconClock size={14} />
                                    </ThemeIcon>
                                    <Text>Created At</Text>
                                </Group>
                            </Table.Th>
                            <Table.Th className="text-gray-700 font-semibold">
                                <Group gap="xs" justify="center">
                                    <ThemeIcon size="sm" variant="light" color="blue">
                                        <IconSettings size={14} />
                                    </ThemeIcon>
                                    <Text>Actions</Text>
                                </Group>
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </ScrollArea>
        </Paper>
    );
};

export default UserTable; 