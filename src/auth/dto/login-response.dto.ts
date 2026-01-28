export class LoginTokensResponseDto {
  accessToken: string;
  refreshToken: string;
}
export class LoginUserInfoResponseDto {
  id: string;
  email: string;
  name: string;
  is_verified: boolean;
}

export class LoginResponseDto {
  message: string;
  data: LoginUserInfoResponseDto;
  tokens: LoginTokensResponseDto;
}