export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
  status: string;
}

export interface RoleOption {
  value: string;
  label: string;
  description: string;
}

export interface StatusOption {
  value: string;
  label: string;
}

export interface BaseModalProps {
  open: boolean;
  onClose: () => void;
}

export interface AddAdminModalProps extends BaseModalProps {
  roleOptions: RoleOption[];
}

export interface EditAdminModalProps extends BaseModalProps {
  admin: Admin | null;
  roleOptions: RoleOption[];
}

export interface AdminDetailsModalProps extends BaseModalProps {
  admin: Admin | null;
}

export interface AuditLogModalProps extends BaseModalProps {
  admin: Admin | null;
} 