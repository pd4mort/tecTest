// src/types/userTypes.ts
export interface UserParams {
  id: string;
}

export interface UserBody {
  email: string;
  name: string;
  password: string;
  role: 'god' | 'admin' | 'user';
}
