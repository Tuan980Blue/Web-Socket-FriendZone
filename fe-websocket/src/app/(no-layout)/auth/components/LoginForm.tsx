import { useState } from 'react';
import { TextInput, PasswordInput, Button, Stack, Text, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { auth } from '@/services/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useUserData } from '@/hooks/useUserData';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUserData();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const response = await auth.login(values);
      
      // Store token in localStorage for API authentication
      localStorage.setItem('token', response.token);
      
      // Update user data in context (this will also handle token expiration)
      setUser(response.user);
      
      notifications.show({
        title: 'Success',
        message: 'Login successful!',
        color: 'green',
      });
      
      router.push('/');
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Login failed',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          required
          label="Email"
          placeholder="Enter your email"
          {...form.getInputProps('email')}
        />
        
        <PasswordInput
          required
          label="Password"
          placeholder="Enter your password"
          {...form.getInputProps('password')}
        />

        <Group justify="space-between" mt="xl">
          <Text size="sm" c="dimmed">
            Don&apos;t have an account?{' '}
            <Text
              component="span"
              c="blue"
              style={{ cursor: 'pointer' }}
              onClick={() => router.push('/auth?tab=register')}
            >
              Register
            </Text>
          </Text>
          <Button type="submit" loading={loading}>
            Login
          </Button>
        </Group>
      </Stack>
    </form>
  );
}