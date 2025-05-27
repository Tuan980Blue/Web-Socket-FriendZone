import { useState, useRef, useEffect } from 'react';
import { TextInput, Button, Stack, Text, Group, PasswordInput, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { auth } from '@/services/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

type FormStep = 'email' | 'otp';

const OTPInput = ({ value, onChange, onComplete }: { 
  value: string; 
  onChange: (value: string) => void;
  onComplete: () => void;
}) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useEffect(() => {
    if (value.length === 6) {
      onComplete();
    }
  }, [value, onComplete]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    if (newValue.length > 1) {
      return;
    }

    const newOtp = value.split('');
    newOtp[index] = newValue;
    const otpValue = newOtp.join('');
    onChange(otpValue);

    if (newValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
      if (pastedData.length === 6) {
        onComplete();
      }
    }
  };

  return (
    <Group gap="xs" justify="center" wrap="nowrap">
      {Array.from({ length: 6 }).map((_, index) => (
        <Box
          key={index}
          style={{
            position: 'relative',
            width: '40px',
            height: '48px',
          }}
        >
          <TextInput
            ref={(el: HTMLInputElement | null) => {
              inputRefs.current[index] = el;
            }}
            value={value[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            maxLength={1}
            size="md"
            styles={{
              input: {
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: 600,
                padding: 0,
                height: '48px',
                width: '40px',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: focusedIndex === index 
                  ? 'var(--primary-gradient-via)'
                  : 'var(--mantine-color-gray-3)',
                transition: 'all 0.2s ease',
                backgroundColor: 'white',
                color: 'inherit',
                '&:focus': {
                  borderColor: 'var(--primary-gradient-via)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
                '&:hover': {
                  borderColor: 'var(--primary-gradient-via)',
                },
              },
            }}
          />
        </Box>
      ))}
    </Group>
  );
};

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
      <Stack gap="md">
        <Text size="sm" c="dimmed" ta="center" mb="md">
          Enter the 6-digit code sent to your email
        </Text>

        <Box>
          <Text size="sm" fw={500} mb={8}>Verification Code</Text>
          <OTPInput
            value={resetForm.values.otp}
            onChange={(value) => resetForm.setFieldValue('otp', value)}
            onComplete={() => resetForm.validateField('otp')}
          />
          {resetForm.errors.otp && (
            <Text size="xs" c="red" mt={4}>
              {resetForm.errors.otp}
            </Text>
          )}
        </Box>

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
            visibilityToggle: {
              color: 'var(--mantine-color-gray-6)',
              width: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                color: 'var(--primary-gradient-via)',
                backgroundColor: 'transparent',
              },
              '&[data-visible="true"]': {
                color: 'var(--primary-gradient-via)',
              },
            },
            innerInput: {
              '&::placeholder': {
                color: 'var(--mantine-color-gray-5)',
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