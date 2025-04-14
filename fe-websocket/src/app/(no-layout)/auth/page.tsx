'use client';

import {useEffect, useState, Suspense} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Notifications} from '@mantine/notifications';
import {
    Container,
    Paper,
    Title,
    Tabs,
    rem,
    Loader,
    Grid,
    Box,
    useMantineTheme, Text, Group,
} from '@mantine/core';
import {IconLogin, IconUserPlus} from '@tabler/icons-react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import Image from "next/image";

// AuthContent component that uses useSearchParams
function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<string | null>('login');
    const theme = useMantineTheme();

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            // Redirect to home if already logged in
            router.push('/');
        }

        // Set active tab based on URL parameter
        const tab = searchParams.get('tab');
        if (tab === 'register' || tab === 'login' || tab === 'forgot-password') {
            setActiveTab(tab);
        }
    }, [router, searchParams]);

    const handleTabChange = (value: string | null) => {
        setActiveTab(value);
        // Update URL without page reload
        let newUrl = '/auth';
        if (value === 'register') {
            newUrl = '/auth?tab=register';
        } else if (value === 'forgot-password') {
            newUrl = '/auth?tab=forgot-password';
        }
        router.push(newUrl);
    };

    return (
        <Container fluid p={0} h="100vh">
            <Grid gutter={0} h="100%">
                {/* Left side - Image */}
                <Grid.Col span={{base: 0, md: 5}} h="100%" display={{base: 'none', md: 'block'}} className={"mt-[8%]"}>
                    <Box
                        h="100%"
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <Image
                            src="/bg-Auth.png"
                            alt="Authentication background"
                            width={800}
                            height={600}
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                                transform: 'scale(1.1)',
                                transition: 'transform 0.3s ease-in-out',
                            }}
                        />
                        <Box
                            style={{
                                position: 'absolute',
                                top: '60%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                color: 'white',
                                zIndex: 2,
                                width: '90%',
                                maxWidth: '500px',
                                padding: '1rem',
                                backdropFilter: 'blur(5px)',
                                borderRadius: '1rem',
                                background: 'rgba(255, 255, 255, 0.4)',
                            }}
                        >
                            {/* Logo */}
                            <Group className="flex items-center">
                                <div
                                    className="relative w-12 h-12 overflow-hidden rounded-xl transform transition-transform duration-300">
                                    <Image
                                        src="/logo2.png"
                                        alt="Logo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-primery">FriendZone</span>
                                    <span className="text-xs text-[#666666] dark:text-[#A0A0A0]">Connect & Share</span>
                                </div>
                                <Text
                                    mt="md"
                                    size="sm"
                                    c="dimmed"
                                    ta="center"
                                    style={{
                                        fontStyle: 'italic',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    &ldquo;Nơi câu chuyện của bạn được lắng nghe.&rdquo;
                                </Text>
                            </Group>
                        </Box>
                    </Box>
                </Grid.Col>

                {/* Right side - Form */}
                <Grid.Col span={{base: 12, md: 6}} h="100%">
                    <Box
                        h="100%"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '2rem',
                            backgroundColor: theme.colors.gray[0]
                        }}
                    >
                        <Box
                            maw={380}
                            mx="auto"
                            w="100%"
                            style={{
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                paddingRight: '1rem',
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'var(--border) var(--background)',
                            }}
                            className="custom-scrollbar"
                        >
                            <div className={"flex justify-center items-center gap-2 mb-2 md:mb-4"}>
                                <Image src={"/logo2.png"} alt={"Logo"}
                                       width={35}
                                       height={35}
                                />
                                <Title
                                    ta="center"
                                    fw={900}
                                    size="h2"
                                    style={{
                                        background: `linear-gradient(45deg, var(--primary-gradient-from), var(--primary-gradient-via), var(--primary-gradient-to))`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    {activeTab === 'login' ? 'Welcome Back!' : activeTab === 'register' ? 'Join Us Today!' : 'Reset Password'}
                                </Title>
                            </div>
                            <Paper
                                withBorder
                                shadow="md"
                                p={24}
                                radius="md"
                                style={{
                                    backgroundColor: 'white',
                                    backdropFilter: 'blur(10px)',
                                    borderColor: 'var(--border)',
                                }}
                            >
                                <Tabs value={activeTab} onChange={handleTabChange}>
                                    <Tabs.List grow mb="md">
                                        <Tabs.Tab
                                            value="login"
                                            leftSection={<IconLogin style={{width: rem(16), height: rem(16)}}/>}
                                        >
                                            Login
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            value="register"
                                            leftSection={<IconUserPlus style={{width: rem(16), height: rem(16)}}/>}
                                        >
                                            Register
                                        </Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="login">
                                        <LoginForm/>
                                    </Tabs.Panel>

                                    <Tabs.Panel value="register">
                                        <RegisterForm/>
                                    </Tabs.Panel>

                                    <Tabs.Panel value="forgot-password">
                                        <ForgotPasswordForm/>
                                    </Tabs.Panel>
                                </Tabs>
                            </Paper>
                        </Box>
                    </Box>
                </Grid.Col>
            </Grid>
        </Container>
    );
}

// Main Auth component with Suspense boundary
export default function Auth() {
    return (
        <main style={{height: '100vh', overflow: 'hidden'}}>
            <Notifications position="top-right" autoClose={2000}/>
            <Suspense fallback={
                <Container size={420} my={40} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Loader size="xl"/>
                </Container>
            }>
                <AuthContent/>
            </Suspense>
        </main>
    );
} 