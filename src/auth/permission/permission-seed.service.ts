import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import permissionsConfig from '../../../json/admin.permission.json';
import { PrismaService } from 'src/prisma/prisma.service';

type RolesConfig = typeof permissionsConfig.roles;

@Injectable()
export class PermissionSeedService implements OnModuleInit {
  private readonly logger = new Logger(PermissionSeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const roles = permissionsConfig.roles as RolesConfig;

    // Admin permission
    let adminPermission = await this.prisma.permission.findFirst({
      where: { name: 'admin' },
    });
    if (adminPermission) {
      await this.prisma.permission.update({
        where: { id: adminPermission.id },
        data: { rules: roles.admin },
      });
    } else {
      adminPermission = await this.prisma.permission.create({
        data: { name: 'admin', rules: roles.admin },
      });
    }

    // User permission
    let userPermission = await this.prisma.permission.findFirst({
      where: { name: 'user' },
    });
    if (userPermission) {
      await this.prisma.permission.update({
        where: { id: userPermission.id },
        data: { rules: roles.user },
      });
    } else {
      userPermission = await this.prisma.permission.create({
        data: { name: 'user', rules: roles.user },
      });
    }

    await this.prisma.admin.updateMany({
      where: { permission_id: null },
      data: { permission_id: adminPermission.id },
    });

    await this.prisma.user.updateMany({
      where: { permission_id: null },
      data: { permission_id: userPermission.id },
    });

    this.logger.log(
      `Permissions seeded: admin=${adminPermission.id}, user=${userPermission.id}`,
    );
  }
}
