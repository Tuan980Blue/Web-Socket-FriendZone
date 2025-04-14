import { useState } from 'react';
import { TextInput, Button, Stack, Text, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { auth } from '@/services/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      await auth.forgotPassword(values.email);
      
      notifications.show({
        title: 'Success',
        message: 'Password reset instructions have been sent to your email.',
        color: 'green',
      });
      
      router.push('/auth?tab=login');
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Failed to process request',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <Text size="sm" c="dimmed" ta="center" mb="md">
          Enter your email address and we will send you instructions to reset your password.
        </Text>

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
          Send Reset Instructions
        </Button>

        <Group justify="center" mt="xs">
          <Text size="xs" c="dimmed">
            Remember your password?{' '}
            <Text
              component="span"
              style={{ 
                cursor: 'pointer',
                background: 'linear-gradient(45deg, var(--primary-gradient-from), var(--primary-gradient-via), var(--primary-gradient-to))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              onClick={() => router.push('/auth?tab=login')}
            >
              Log in
            </Text>
          </Text>
        </Group>
      </Stack>
    </form>
  );
} 