import { IsString, MinLength, Length, IsEmail } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class OtpDto {
  @ApiProperty({ example: '123456', description: '6 digit OTP code' })
  @IsString()
  @Length(6, 6, { message: '6 digit otp required' })
  otp: string;

  @ApiProperty({ example: 'test@gmail.com', description: 'User email address' })
  @IsEmail()
  email: string;
}
