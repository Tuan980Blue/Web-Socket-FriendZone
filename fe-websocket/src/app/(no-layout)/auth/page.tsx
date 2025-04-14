'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Notifications } from '@mantine/notifications';
import { Container, Paper, Title, Tabs, rem, Loader } from '@mantine/core';
import { IconLogin, IconUserPlus } from '@tabler/icons-react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

// AuthContent component that uses useSearchParams
function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string | null>('login');

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
    if (tab === 'register' || tab === 'login') {
      setActiveTab(tab);
    }
  }, [router, searchParams]);

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
    // Update URL without page reload
    const newUrl = value === 'login' ? '/auth' : '/auth?tab=register';
    router.push(newUrl);
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Welcome back!
      </Title>
      
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tabs.List grow mb="md">
            <Tabs.Tab
              value="login"
              leftSection={<IconLogin style={{ width: rem(16), height: rem(16) }} />}
            >
              Login
            </Tabs.Tab>
            <Tabs.Tab
              value="register"
              leftSection={<IconUserPlus style={{ width: rem(16), height: rem(16) }} />}
            >
              Register
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login">
            <LoginForm />
          </Tabs.Panel>

          <Tabs.Panel value="register">
            <RegisterForm />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}

// Main Auth component with Suspense boundary
export default function Auth() {
  return (
    <main>
      <Notifications position="top-right" />
      <Suspense fallback={
        <Container size={420} my={40} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader size="xl" />
        </Container>
      }>
        <AuthContent />
      </Suspense>
    </main>
  );
} 