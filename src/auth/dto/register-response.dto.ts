
export class UserResponseDto {
    id: string;
    email: string;
    name: string;
    is_verified: boolean;
}

export class RegisterResponseDto {
    message: string;
    data: UserResponseDto;
}