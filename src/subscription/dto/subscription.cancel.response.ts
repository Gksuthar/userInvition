export class SubscriptionCancelResponseDto {
  subscriptionId: string;
  cancelledByAdminId: string | null;
  status: 'CANCEL' | 'ACTIVE';
}
