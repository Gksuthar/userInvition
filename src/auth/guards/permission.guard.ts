import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import permissionsConfig from '../../../json/admin.permission.json';

import { PERMISSION_KEY } from '../decorator/require-permission.decorator';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly logger: Logger,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const required = this.reflector.getAllAndOverride<{
      feature: string;
      action: string;
      userType?: string;
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);
    if (!required) return true;
    const user = req.user;
    if (!user) throw new ForbiddenException('Not authenticated');

    const role = user.role;
    this.logger.log({ role }, '----userId----?');

    const rolePermissions = permissionsConfig.roles?.[role];
    if (!rolePermissions)
      throw new ForbiddenException('Role has no permissions defined');

    const allowed =
      rolePermissions?.[required.feature]?.[required.action] === true;
    this.logger.log({ allowed }, '--------?');
    if (!allowed) {
      throw new ForbiddenException(
        `You do not have permission to ${required.action} ${required.feature}.`,
      );
    }
    return true;
  }
}
