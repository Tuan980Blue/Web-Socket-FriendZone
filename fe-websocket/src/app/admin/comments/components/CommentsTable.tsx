'use client'

import { useState } from 'react';
import {
  Table,
  Text,
  ActionIcon,
  Menu,
  Badge,
  Group,
  TextInput,
} from '@mantine/core';
import { IconDots, IconSearch, IconTrash, IconExternalLink } from '@tabler/icons-react';

// Mock data
const comments = [
  {
    id: 1,
    content: 'Great post!',
    author: 'John Doe',
    postTitle: 'First Post',
    postId: 1,
    createdAt: '2024-03-15',
    status: 'active',
  },
  {
    id: 2,
    content: 'Interesting perspective',
    author: 'Jane Smith',
    postTitle: 'Second Post',
    postId: 2,
    createdAt: '2024-03-14',
    status: 'hidden',
  },
];

export function CommentsTable() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComments = comments.filter(
    (comment) =>
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text fw={700} size="xl">
          Comments Management
        </Text>
      </Group>

      <TextInput
        placeholder="Search comments..."
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        mb="md"
      />

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Content</th>
            <th>Author</th>
            <th>Post</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredComments.map((comment) => (
            <tr key={comment.id}>
              <td style={{ maxWidth: '300px' }}>
                <Text truncate>{comment.content}</Text>
              </td>
              <td>{comment.author}</td>
              <td>{comment.postTitle}</td>
              <td>{comment.createdAt}</td>
              <td>
                <Badge
                  color={comment.status === 'active' ? 'green' : 'red'}
                  variant="light"
                >
                  {comment.status}
                </Badge>
              </td>
              <td>
                <Menu position="bottom-end" withinPortal>
                  <Menu.Target>
                    <ActionIcon>
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item>
                      <IconExternalLink size={16} style={{ marginRight: 8 }} />
                      View Post
                    </Menu.Item>
                    <Menu.Item color="red">
                      <IconTrash size={16} style={{ marginRight: 8 }} />
                      Delete Comment
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
} 