'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/hooks/useUserData';
import { Button, Container, Text, Title, Stack, Box } from '@mantine/core';
import { IconLogin, IconUserPlus } from '@tabler/icons-react';
import Image from 'next/image';

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { user, isLoading } = useUserData();
    const router = useRouter();

    if (isLoading) {
        return null;
    }

    if (!user) {
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
                    <div className="flex justify-center items-center gap-2 mb-6">
                        <Image src="/logo2.png" alt="Logo" width={40} height={40} />
                        <Title
                            order={1}
                            style={{
                                background: 'linear-gradient(45deg, #F58529, #DD2A7B, #515BD4)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            FriendZone Social
                        </Title>
                    </div>

                    <Title order={2} mb="md">
                        Bạn cần đăng nhập để sử dụng tính năng này
                    </Title>

                    <Text c="dimmed" size="lg" mb="xl" maw={580}>
                        Vui lòng đăng nhập hoặc tạo tài khoản mới để tiếp tục trải nghiệm các tính năng tuyệt vời của chúng tôi
                    </Text>

                    <Stack gap="md" w="100%" maw={400}>
                        <Button
                            size="lg"
                            radius="md"
                            leftSection={<IconLogin size={20} />}
                            onClick={() => router.push('/auth?tab=login')}
                            style={{
                                background: 'linear-gradient(45deg, #F58529, #DD2A7B, #515BD4)',
                                border: 'none',
                            }}
                        >
                            Đăng nhập
                        </Button>

                        <Button
                            size="lg"
                            radius="md"
                            variant="outline"
                            leftSection={<IconUserPlus size={20} />}
                            onClick={() => router.push('/auth?tab=register')}
                            style={{
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)',
                            }}
                        >
                            Tạo tài khoản mới
                        </Button>
                    </Stack>
                </Box>
            </Container>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;