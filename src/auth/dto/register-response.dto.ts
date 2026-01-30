export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  is_verified: boolean;
  tenant_id?: string;
}

export class RegisterResponseDto {
  message: string;
  data: UserResponseDto;
}
