import { ApiProperty } from '@nestjs/swagger';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCEL = 'CANCEL',
}

export class SubscriptionDto {
  @ApiProperty({ example: 'uuid-subscription-id' })
  id: string;

  @ApiProperty({ example: 'uuid-user-id' })
  userId: string;

  @ApiProperty({ enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'uuid-admin-id',
  })
  cancelled_by_admin_id?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'uuid-user-id',
  })
  cancelled_by_user_id?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: '2026-01-28T10:00:00.000Z',
  })
  cancelled_at?: Date | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
