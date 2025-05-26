import { useState, useCallback } from "react";
import { useForm } from "@mantine/form";
import { auth } from "@/services/api";
import { notifications } from "@mantine/notifications";
import { Button, Modal, PasswordInput, Stack, Text } from "@mantine/core";
import { UserInContext } from "@/types/user";
import { GoogleUserInfo } from "@/types/google";

interface GoogleLoginRequest {
    email: string;
    name: string;
    picture: string;
    googleId: string;
    password?: string;
}

interface GoogleLoginResponse {
    token: string;
    user: UserInContext;
    requirePassword?: boolean;
}

interface CreatePasswordFormValues {
    password: string;
    confirmPassword: string;
}

interface CreatePasswordModalProps {
    opened: boolean;
    onClose: () => void;
    userInfo: GoogleUserInfo;
    onSuccess: (response: GoogleLoginResponse) => void;
}

export default function CreatePasswordModal({
    opened,
    onClose,
    userInfo,
    onSuccess
}: CreatePasswordModalProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<CreatePasswordFormValues>({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: {
            password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords do not match' : null,
        },
    });

    const handleSubmit = useCallback(async (values: CreatePasswordFormValues) => {
        try {
            setLoading(true);
            const requestData: GoogleLoginRequest = {
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                googleId: userInfo.sub,
                password: values.password
            };
            const response = await auth.googleLogin(requestData);
            onSuccess(response);
            onClose();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to create account. Please try again.',
                color: 'red',
            });
            console.error('Create password error:', error);
        } finally {
            setLoading(false);
        }
    }, [userInfo, onSuccess, onClose]);

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
        <Modal
            opened={opened}
            onClose={onClose}
            title="Create Password"
            centered
            size="sm"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <Text size="sm" c="dimmed">
                        Please create a password for your account. You will use this password to log in with your email.
                    </Text>

                    <PasswordInput
                        required
                        label="Password"
                        placeholder="Enter your password"
                        {...form.getInputProps('password')}
                        styles={inputStyles}
                    />

                    <PasswordInput
                        required
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        {...form.getInputProps('confirmPassword')}
                        styles={inputStyles}
                    />

                    <Button
                        type="submit"
                        loading={loading}
                        fullWidth
                        mt="md"
                        style={{
                            background: 'linear-gradient(45deg, var(--primary-gradient-from), var(--primary-gradient-via), var(--primary-gradient-to))',
                        }}
                    >
                        Create Account
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
}