import { useState } from 'react';
import { TextInput, PasswordInput, Button, Stack, Text, Group, Divider, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { auth } from '@/services/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useUserData } from '@/hooks/useUserData';
import { IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';

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
      <Stack gap="sm">
        <TextInput
          required
          size="sm"
          label="Email"
          placeholder="Enter your email"
          radius="md"
          {...form.getInputProps('email')}
          styles={{
            input: {
              '&:focus': {
                borderColor: 'var(--primary-gradient-via)',
              },
            },
          }}
        />
        
        <PasswordInput
          required
          size="sm"
          label="Password"
          placeholder="Enter your password"
          radius="md"
          {...form.getInputProps('password')}
          styles={{
            input: {
              '&:focus': {
                borderColor: 'var(--primary-gradient-via)',
              },
            },
          }}
        />

        <Text 
          size="xs" 
          c="blue" 
          style={{ cursor: 'pointer', alignSelf: 'flex-end' }}
          onClick={() => router.push('/auth?tab=forgot-password')}
        >
          Forgot password?
        </Text>

        <Button 
          type="submit" 
          loading={loading}
          size="sm"
          radius="md"
          fullWidth
          mt="xs"
          style={{
            background: 'linear-gradient(45deg, var(--primary-gradient-from), var(--primary-gradient-via), var(--primary-gradient-to))',
          }}
        >
          Log in
        </Button>

        <Group gap="xs" justify="center" mt="xs">
          <Divider w={80} />
          <Text size="xs" c="dimmed">or</Text>
          <Divider w={80} />
        </Group>

        <Group grow>
          <Button
            variant="default"
            size="sm"
            radius="md"
            leftSection={<IconBrandGoogle style={{ width: rem(16), height: rem(16), color: "orangered"}} />}
            styles={{
              root: {
                borderColor: 'var(--border)',
                '&:hover': {
                  backgroundColor: 'var(--background)',
                },
              },
            }}
          >
            Google
          </Button>
          <Button
            variant="default"
            size="sm"
            radius="md"
            leftSection={<IconBrandFacebook style={{ width: rem(16), height: rem(16) , color: "blue"}} />}
            styles={{
              root: {
                borderColor: 'var(--border)',
                '&:hover': {
                  backgroundColor: 'var(--background)',
                },
              },
            }}
          >
            Facebook
          </Button>
        </Group>

        <Group justify="center" mt="xs">
          <Text size="xs" c="dimmed">
            Don&apos;t have an account?{' '}
            <Text
              component="span"
              style={{ 
                cursor: 'pointer',
                background: 'linear-gradient(45deg, var(--primary-gradient-from), var(--primary-gradient-via), var(--primary-gradient-to))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              onClick={() => router.push('/auth?tab=register')}
            >
              Sign up
            </Text>
          </Text>
        </Group>
      </Stack>
    </form>
  );
}