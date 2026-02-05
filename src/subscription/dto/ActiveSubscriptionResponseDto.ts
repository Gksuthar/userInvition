export class ActiveSubscriptionResponseDto {
  id: string;
  userId: string;
  status: string;
  startedAt: Date;
  planId?: string;
  endedAt?: Date | null;
}
