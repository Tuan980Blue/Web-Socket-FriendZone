import { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Stack, Select, Text, Divider, rem } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { auth } from '@/services/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const inputStyles = {
    input: {
      '&:focus': {
        borderColor: 'var(--primary-gradient-via)',
      },
    },
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <TextInput
          required
          size="sm"
          label="Username"
          placeholder="Choose a username"
          radius="md"
          {...form.getInputProps('username')}
          styles={inputStyles}
        />
        
        <TextInput
          required
          size="sm"
          label="Email"
          placeholder="Enter your email"
          radius="md"
          {...form.getInputProps('email')}
          styles={inputStyles}
        />
        
        <PasswordInput
          required
          size="sm"
          label="Password"
          placeholder="Create a password"
          radius="md"
          {...form.getInputProps('password')}
          styles={inputStyles}
        />

        <PasswordInput
          required
          size="sm"
          label="Confirm Password"
          placeholder="Confirm your password"
          radius="md"
          {...form.getInputProps('confirmPassword')}
          styles={inputStyles}
        />
        
        <TextInput
          required
          size="sm"
          label="Full Name"
          placeholder="Enter your full name"
          radius="md"
          {...form.getInputProps('fullName')}
          styles={inputStyles}
        />
        
        <Select
          required
          size="sm"
          label="Gender"
          placeholder="Select your gender"
          radius="md"
          data={[
            { value: 'MALE', label: 'Male' },
            { value: 'FEMALE', label: 'Female' },
            { value: 'OTHER', label: 'Other' },
          ]}
          {...form.getInputProps('gender')}
          styles={inputStyles}
        />
        
        <DateInput
          required
          size="sm"
          label="Birth Date"
          placeholder="Select your birth date"
          radius="md"
          maxDate={new Date()}
          {...form.getInputProps('birthDate')}
          styles={inputStyles}
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
          Create Account
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
            leftSection={<IconBrandGoogle style={{ width: rem(16), height: rem(16), color: "orangered" }} />}
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
            leftSection={<IconBrandFacebook style={{ width: rem(16), height: rem(16), color: "blue" }} />}
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
            Already have an account?{' '}
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