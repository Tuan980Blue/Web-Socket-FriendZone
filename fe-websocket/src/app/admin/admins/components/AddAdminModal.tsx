import { Modal, TextInput, Select, Button, Checkbox, Group, Text, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { generatePassword } from '@/utils/password';

interface RoleOption {
  value: string;
  label: string;
  description: string;
}

interface AddAdminModalProps {
  open: boolean;
  onClose: () => void;
  roleOptions: RoleOption[];
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ open, onClose, roleOptions }) => {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: '',
      sendEmail: true,
    },
    validate: {
      name: (value) => (!value ? 'Vui lòng nhập tên' : null),
      email: (value) => {
        if (!value) return 'Vui lòng nhập email';
        if (!/^\S+@\S+$/.test(value)) return 'Email không hợp lệ';
        return null;
      },
      password: (value) => (!value ? 'Vui lòng nhập mật khẩu' : null),
      role: (value) => (!value ? 'Vui lòng chọn vai trò' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // Here you would typically make an API call to create the admin
      console.log('Form values:', values);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  const handleGeneratePassword = () => {
    const password = generatePassword();
    form.setFieldValue('password', password);
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Thêm Admin Mới"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Tên"
            placeholder="Nhập tên admin"
            required
            {...form.getInputProps('name')}
          />

          <TextInput
            label="Email"
            placeholder="Nhập email"
            required
            {...form.getInputProps('email')}
          />

          <TextInput
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            required
            type="password"
            rightSection={
              <Button variant="subtle" size="xs" onClick={handleGeneratePassword}>
                Tạo ngẫu nhiên
              </Button>
            }
            {...form.getInputProps('password')}
          />

          <Select
            label="Vai trò"
            placeholder="Chọn vai trò"
            required
            data={roleOptions}
            {...form.getInputProps('role')}
            comboboxProps={{
              withinPortal: true,
              transitionProps: { transition: 'pop', duration: 200 }
            }}
            renderOption={({ option }) => {
              const roleOption = option as unknown as RoleOption;
              return (
                <div>
                  <Text size="sm">{roleOption.label}</Text>
                  <Text size="xs" c="dimmed">{roleOption.description}</Text>
                </div>
              );
            }}
          />

          <Checkbox
            label="Gửi email thông báo tạo tài khoản"
            {...form.getInputProps('sendEmail', { type: 'checkbox' })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              Tạo Admin
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddAdminModal; 