import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';

export const PERMISSION_KEY = 'ganesh';

export function RequirePermission(
  feature: string,
  action: string,
  userType?: string,
) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, PermissionGuard),
    SetMetadata(PERMISSION_KEY, { feature, action, userType }),
  );
}