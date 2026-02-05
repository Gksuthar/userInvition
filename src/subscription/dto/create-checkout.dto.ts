import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({
    example: 'e53a1fe0-c5bc-4119-81aa-xxxx',
    description: 'Plan ID from database',
  })
  @IsUUID()
  planId: string;

  @ApiProperty({
    example: 'e53a1fe0-c5bc-4119-81aa',
    description: 'Enter User Id',
  })
  @IsUUID()
  userId: string;
}
