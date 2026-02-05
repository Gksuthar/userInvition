export class UserInfoResponseDto {
  id: string;
  email: string;
  name: string;
  is_verified?: boolean;
  invite_by?: string | null;
  role?: string;
}