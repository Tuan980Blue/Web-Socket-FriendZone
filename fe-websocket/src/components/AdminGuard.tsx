'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/hooks/useUserData';
import { Button, Container, Text, Title, Stack, Box, Center } from '@mantine/core';
import { IconLock, IconArrowLeft } from '@tabler/icons-react';

interface AdminGuardProps {
    children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
    const { user, isLoading } = useUserData();
    const router = useRouter();

    if (isLoading) {
        return null;
    }

    //sau nay bo sung them role cho User.
    // || user.role !== 'ADMIN'

    if (!user || user.username !== 'tuananhjr21') {
        return (
            <Container size="sm" py={80}>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '60vh',
                        textAlign: 'center',
                    }}
                >
                    <Center mb="xl">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] flex items-center justify-center">
                            <IconLock size={40} className="text-white" />
                        </div>
                    </Center>

                    <Title order={2} mb="md">
                        Truy cập bị từ chối
                    </Title>

                    <Text c="dimmed" size="lg" mb="xl" maw={580}>
                        Bạn không có quyền truy cập vào trang quản trị. Chỉ người dùng có vai trò Admin mới được phép truy cập.
                    </Text>

                    <Stack gap="md" w="100%" maw={400}>
                        <Button
                            size="lg"
                            radius="md"
                            variant="outline"
                            leftSection={<IconArrowLeft size={20} />}
                            onClick={() => router.back()}
                            style={{
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)',
                            }}
                        >
                            Quay lại trang trước
                        </Button>

                        <Button
                            size="lg"
                            radius="md"
                            leftSection={<IconLock size={20} />}
                            onClick={() => router.push('/')}
                            style={{
                                background: 'linear-gradient(45deg, #F58529, #DD2A7B, #515BD4)',
                                border: 'none',
                            }}
                        >
                            Về trang chủ
                        </Button>
                    </Stack>
                </Box>
            </Container>
        );
    }

    return <>{children}</>;
};

export default AdminGuard;