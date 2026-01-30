// dto/user-tenant.response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserTenantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  tenant_id: string;

  @ApiPropertyOptional()
  deleted_at?: Date | null;

  @ApiPropertyOptional()
  deleted_by_id?: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
