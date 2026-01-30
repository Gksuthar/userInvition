import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'password', default: '' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password', default: '' })
  @IsString()
  password: string;
}
