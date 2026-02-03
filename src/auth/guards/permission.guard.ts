import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSION_KEY } from '../decorator/require-permission.decorator';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const required = this.reflector.getAllAndOverride<{
      feature: string;
      action: string;
      userType?: string;
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);
    if (!required) return true;
    const user = req.user;
    if (!user) throw new ForbiddenException('Not authenticated');
    console.log('userType========================================'+JSON.stringify(user));
    const role = user.role;
    this.logger.log({ role }, '----userId----?');

    if (role === 'super_Admin') {
      return true;
    }

    const permission = await this.prisma.permission.findFirst({
      where: { name: role },
    });
    if (!permission || !permission.rules)
      throw new ForbiddenException('Role has no permissions defined');
    const rules = permission.rules;
    console.log('data is-------------------------->' + JSON.stringify(rules));
    const allowed = rules?.[required.feature]?.[required.action] === true;
    console.log(
      'allowed------------------------------------------------------>',
      allowed,
    );
    if (!allowed) {
      throw new ForbiddenException(
        `You do not have permission to ${required.action} ${required.feature}.`,
      );
    }
    return true;
  }
}
