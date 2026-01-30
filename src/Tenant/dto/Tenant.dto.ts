import { ApiProperty } from '@nestjs/swagger';

export class TenantDto {
  @ApiProperty({ example: 'My Company Pvt Ltd' })
  name: string;

  @ApiProperty({ example: 'my-company' })
  slug: string;

  created_at?: Date;
}
