export interface UserBody {
  email: string;
  name: string;
  password: string;
  role?: string;
}

export interface UserParams {
  id: string;
}
