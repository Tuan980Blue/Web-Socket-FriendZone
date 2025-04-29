'use client';

import React from 'react';
import { Center, Text, Button, Container } from '@mantine/core';
import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

interface PostNotFoundProps {
    type: 'error' | 'not-found';
}

const PostNotFound: React.FC<PostNotFoundProps> = ({ type }) => {
    return (
        <Container size="sm" py="xl">
            <Center className="flex flex-col space-y-4 min-h-[60vh]">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <AlertCircle size={40} className="text-gray-400" />
                </div>
                
                <Text fw={500} size="xl" className="text-center">
                    {type === 'error' 
                        ? 'Đã xảy ra lỗi khi tải bài viết'
                        : 'Không tìm thấy bài viết'}
                </Text>
                
                <Text size="sm" c="dimmed" className="text-center max-w-md">
                    {type === 'error'
                        ? 'Có vẻ như đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại sau.'
                        : 'Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.'}
                </Text>

                <Link href="/" passHref>
                    <Button
                        leftSection={<Home size={16} />}
                        variant="light"
                        color="blue"
                        radius="xl"
                    >
                        Quay về trang chủ
                    </Button>
                </Link>
            </Center>
        </Container>
    );
};

export default PostNotFound; 