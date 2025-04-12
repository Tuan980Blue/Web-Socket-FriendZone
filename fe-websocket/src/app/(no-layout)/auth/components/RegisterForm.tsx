import { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Stack, Select, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { auth } from '@/services/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      gender: '',
      birthDate: null as Date | null,
    },
    validate: {
      username: (value) => (value.length < 3 ? 'Username must be at least 3 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
      fullName: (value) => (value.length < 2 ? 'Full name must be at least 2 characters' : null),
      gender: (value) => (!value ? 'Please select your gender' : null),
      birthDate: (value) => (!value ? 'Please select your birth date' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const { confirmPassword, ...registerData } = values;
      await auth.register({
        ...registerData,
        birthDate: registerData.birthDate?.toISOString() || null,
      });
      
      notifications.show({
        title: 'Success',
        message: 'Registration successful! Please login with your credentials.',
        color: 'green',
      });
      
      // Redirect to login tab
      router.push('/auth?tab=login');
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Registration failed',
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
          label="Username"
          placeholder="Enter your username"
          {...form.getInputProps('username')}
        />
        
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

        <PasswordInput
          required
          label="Confirm Password"
          placeholder="Confirm your password"
          {...form.getInputProps('confirmPassword')}
        />
        
        <TextInput
          required
          label="Full Name"
          placeholder="Enter your full name"
          {...form.getInputProps('fullName')}
        />
        
        <Select
          required
          label="Gender"
          placeholder="Select your gender"
          data={[
            { value: 'MALE', label: 'Male' },
            { value: 'FEMALE', label: 'Female' },
            { value: 'OTHER', label: 'Other' },
          ]}
          {...form.getInputProps('gender')}
        />
        
        <DateInput
          required
          label="Birth Date"
          placeholder="Select your birth date"
          maxDate={new Date()}
          {...form.getInputProps('birthDate')}
        />

        <Group justify="space-between" mt="xl">
          <Text size="sm" c="dimmed">
            Already have an account?{' '}
            <Text
              component="span"
              c="blue"
              style={{ cursor: 'pointer' }}
              onClick={() => router.push('/auth?tab=login')}
            >
              Login
            </Text>
          </Text>
          <Button type="submit" loading={loading}>
            Register
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 