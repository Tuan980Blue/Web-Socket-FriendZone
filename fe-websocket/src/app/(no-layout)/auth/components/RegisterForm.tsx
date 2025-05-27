import {useState, useCallback} from 'react';
import {TextInput, PasswordInput, Button, Group, Stack, Select, Text, Divider, rem, SimpleGrid} from '@mantine/core';
import {DateInput} from '@mantine/dates';
import {useForm} from '@mantine/form';
import {notifications} from '@mantine/notifications';
import {auth} from '@/services/api';
import {useRouter} from 'next/navigation';
import {AxiosError} from 'axios';
import {IconBrandGoogle} from '@tabler/icons-react';
import {GoogleOAuthProvider, useGoogleLogin} from '@react-oauth/google';
import {useUserData} from '@/hooks/useUserData';
import CreatePasswordModal from './CreatePasswordModal';
import { UserInContext, convertUserInContextToUser } from '@/types/user';
import { GoogleUserInfo } from '@/types/google';

interface GoogleLoginResponse {
    token: string;
    user: UserInContext;
    requirePassword?: boolean;
}

interface RegisterFormValues {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    gender: string;
    birthDate: Date | null;
}

function CustomGoogleLogin({onSuccess}: {onSuccess: (response: GoogleLoginResponse) => void}) {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [googleUserInfo, setGoogleUserInfo] = useState<GoogleUserInfo | null>(null);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {Authorization: `Bearer ${tokenResponse.access_token}`},
                }).then(res => res.json()) as GoogleUserInfo;

                const response = await auth.googleLogin({
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    googleId: userInfo.sub
                });

                if (response.requirePassword) {
                    setGoogleUserInfo(userInfo);
                    setShowPasswordModal(true);
                    return;
                }

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
                leftSection={<IconBrandGoogle style={{width: rem(16), height: rem(16), color: "orangered"}}/>}
                styles={{
                    root: {
                        borderColor: 'var(--border)',
                        '&:hover': {
                            backgroundColor: 'var(--background)',
                        },
                    },
                }}
            >
                Sign up with Google
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

const validateEmail = (value: string): string | null => {
    if (!value) return 'Email is required';
    if (/\s/.test(value)) return 'Email cannot contain spaces';
    if (value.length > 254) return 'Email is too long';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
    if (!value.split('@')[1]?.includes('.')) return 'Invalid email domain';
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) 
        return 'Email contains invalid characters';
    return null;
};

export default function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {setUser} = useUserData();

    const form = useForm<RegisterFormValues>({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            gender: '',
            birthDate: null,
        },
        validate: {
            email: validateEmail,
            password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords do not match' : null,
            fullName: (value) => (value.length < 2 ? 'Full name must be at least 2 characters' : null),
            gender: (value) => (!value ? 'Please select your gender' : null),
            birthDate: (value) => (!value ? 'Please select your birth date' : null),
        },
    });

    const handleSubmit = useCallback(async (values: RegisterFormValues) => {
        try {
            setLoading(true);
            const username = values.email.split('@')[0];
            
            const registerData = {
                email: values.email,
                password: values.password,
                fullName: values.fullName,
                gender: values.gender,
                username,
                birthDate: values.birthDate?.toISOString() || null,
            };
            
            await auth.register(registerData);

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
    }, [router]);

    const handleGoogleSuccess = useCallback(async (response: GoogleLoginResponse) => {
        try {
            setLoading(true);
            setUser(convertUserInContextToUser(response.user));
            
            notifications.show({
                title: 'Success',
                message: 'Registration successful!',
                color: 'green',
            });
            
            router.replace('/');
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
    }, [router, setUser]);

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
            <form onSubmit={form.onSubmit(handleSubmit)} className={"w-[100%]"}>
                <Stack gap="sm">
                    <TextInput
                        required
                        size="sm"
                        label="Full Name"
                        placeholder="Enter your full name"
                        radius="md"
                        {...form.getInputProps('fullName')}
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

                    <SimpleGrid cols={{base: 1, sm: 2}} spacing="sm">
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
                    </SimpleGrid>

                    <SimpleGrid cols={{base: 1, sm: 2}} spacing="sm">
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
                        <Select
                            required
                            size="sm"
                            label="Gender"
                            placeholder="Select your gender"
                            radius="md"
                            data={[
                                {value: 'MALE', label: 'Male'},
                                {value: 'FEMALE', label: 'Female'},
                                {value: 'OTHER', label: 'Other'},
                            ]}
                            {...form.getInputProps('gender')}
                            styles={inputStyles}
                        />
                    </SimpleGrid>

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
                        <Divider w={80}/>
                        <Text size="xs" c="dimmed">or</Text>
                        <Divider w={80}/>
                    </Group>

                    <SimpleGrid cols={{base: 1, md: 2}} spacing="sm">
                        <CustomGoogleLogin onSuccess={handleGoogleSuccess} />
                    </SimpleGrid>

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
        </GoogleOAuthProvider>
    );
} 