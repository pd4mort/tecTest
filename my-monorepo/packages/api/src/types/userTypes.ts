export enum UserRole{
  God = 'god',
  Admin = 'admin',
  User = 'user'
}

export interface UserParams {
  id: string;
}

export interface UserBody {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  profilePicture?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}
