export interface AuthUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user';
  is_verified: boolean;
  delete_by_id: boolean;
}
