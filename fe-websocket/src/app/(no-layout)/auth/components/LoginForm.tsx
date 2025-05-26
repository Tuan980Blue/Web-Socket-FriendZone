import { useState, useEffect, useCallback } from 'react';
import { TextInput, PasswordInput, Button, Stack, Text, Group, Divider, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { auth } from '@/services/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useUserData } from '@/hooks/useUserData';
import { IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import CreatePasswordModal from './CreatePasswordModal';
import { UserInContext } from '@/types/user';
import { GoogleUserInfo } from '@/types/google';

interface GoogleLoginResponse {
  token: string;
  user: UserInContext;
  requirePassword?: boolean;
}

function CustomGoogleLogin({ onSuccess }: { onSuccess: (response: GoogleLoginResponse) => void }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [googleUserInfo, setGoogleUserInfo] = useState<GoogleUserInfo | null>(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info using access token
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json()) as GoogleUserInfo;

        // Send user info to backend
        const response = await auth.googleLogin({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          googleId: userInfo.sub
        });

        // If password is required for new account
        if (response.requirePassword) {
          setGoogleUserInfo(userInfo);
          setShowPasswordModal(true);
          return;
        }

        // If account exists or password was provided
        localStorage.setItem('token', response.token);
        onSuccess(response);
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Google login failed. Please try again.',
          color: 'red',
        });
        console.log(error);
      }
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Google login failed. Please try again.',
        color: 'red',
      });
    },
    flow: 'implicit',
    scope: 'email profile',
  });

  const handlePasswordModalSuccess = useCallback((response: GoogleLoginResponse) => {
    localStorage.setItem('token', response.token);
    onSuccess(response);
  }, [onSuccess]);

  return (
    <>
      <Button
        variant="default"
        size="sm"
        radius="md"
        fullWidth
        onClick={() => login()}
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
        Sign in with Google
      </Button>

      {googleUserInfo && (
        <CreatePasswordModal
          opened={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          userInfo={googleUserInfo}
          onSuccess={handlePasswordModalSuccess}
        />
      )}
    </>
  );
}

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { setUser } = useUserData();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  const handleSubmit = useCallback(async (values: typeof form.values) => {
    if (!mounted) return;

    try {
      setLoading(true);
      const response = await auth.login(values);
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      notifications.show({
        title: 'Success',
        message: 'Login successful!',
        color: 'green',
      });
      
      router.push('/');
    } catch (error) {
      if (!mounted) return;

      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Login failed',
        color: 'red',
      });
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  }, [mounted, router, setUser]);

  const handleGoogleSuccess = useCallback(async (response: GoogleLoginResponse) => {
    if (!mounted) return;
    
    try {
      setLoading(true);
      setUser(response.user);
      
      notifications.show({
        title: 'Success',
        message: 'Login successful!',
        color: 'green',
      });
      
      router.replace('/');
    } catch (error) {
      if (!mounted) return;
      
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Login failed',
        color: 'red',
      });
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  }, [mounted, router, setUser]);

  if (!mounted) {
    return null;
  }

  const inputStyles = {
    input: {
      '&:focus': {
        borderColor: 'var(--primary-gradient-via)',
      },
    },
    visibilityToggle: {
      color: 'var(--primary-gradient-via)',
      opacity: 1,
      '&:hover': {
        color: 'var(--primary-gradient-from)',
      },
    },
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GG_CLIENT_ID || ''}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
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
            placeholder="Enter your password"
            radius="md"
            {...form.getInputProps('password')}
            styles={inputStyles}
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
            <CustomGoogleLogin onSuccess={handleGoogleSuccess} />
            <Button
              variant="default"
              size="sm"
              radius="md"
              leftSection={<IconBrandFacebook style={{ width: rem(16), height: rem(16), color: "blue"}} />}
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
    </GoogleOAuthProvider>
  );
}