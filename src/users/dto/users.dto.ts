export class UserInfoDto {
  name: string;
  id: string;
  created_at: Date;
  updated_at: Date;
  email: string;
  password: string;
  invite_by: string | null;
  role: string;
  is_verified: boolean;
  delete_by_id: string | null;
  deleted_at: Date | null;
}
