import { useState } from 'react';
import { TextInput, Button, Stack, Text, Group, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { auth } from '@/services/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

type FormStep = 'email' | 'otp';

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<FormStep>('email');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const emailForm = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const resetForm = useForm({
    initialValues: {
      otp: '',
      newPassword: '',
    },
    validate: {
      otp: (value) => (value.length === 6 ? null : 'OTP must be 6 digits'),
      newPassword: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
    },
  });

  const handleEmailSubmit = async (values: typeof emailForm.values) => {
    try {
      setLoading(true);
      await auth.forgotPassword(values.email);
      setEmail(values.email);
      setStep('otp');
      notifications.show({
        title: 'Success',
        message: 'OTP has been sent to your email.',
        color: 'green',
      });
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

  const handleResetSubmit = async (values: typeof resetForm.values) => {
    try {
      setLoading(true);
      await auth.resetPassword({
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      
      notifications.show({
        title: 'Success',
        message: 'Password has been reset successfully.',
        color: 'green',
      });
      
      router.push('/auth?tab=login');
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Failed to reset password',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={emailForm.onSubmit(handleEmailSubmit)}>
      <Stack gap="sm">
        <Text size="sm" c="dimmed" ta="center" mb="md">
          Enter your email address and we will send OTP for authentication.
        </Text>

        <TextInput
          required
          size="sm"
          label="Email"
          placeholder="Enter your email"
          radius="md"
          {...emailForm.getInputProps('email')}
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
          Send OTP
        </Button>
      </Stack>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={resetForm.onSubmit(handleResetSubmit)}>
      <Stack gap="sm">
        <Text size="sm" c="dimmed" ta="center" mb="md">
          Enter the OTP sent to your email and your new password.
        </Text>

        <TextInput
          required
          size="sm"
          label="OTP"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          radius="md"
          {...resetForm.getInputProps('otp')}
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
          label="New Password"
          placeholder="Enter new password"
          radius="md"
          {...resetForm.getInputProps('newPassword')}
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
          Reset Password
        </Button>

        <Button
          variant="subtle"
          size="sm"
          onClick={() => setStep('email')}
          fullWidth
        >
          Back to Email
        </Button>
      </Stack>
    </form>
  );

  return (
    <>
      {step === 'email' ? renderEmailStep() : renderOtpStep()}
      
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
    </>
  );
} 