import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from './types/auth-user.type';

@Injectable()
export class AuthAdminRepository {
  constructor(private prisma: PrismaService) {}

  async findAdminByEmail(email: string) {
    return this.prisma.admin.findUnique({
      where: { email },
    });
  }

  async createAdmin(data: { email: string; password: string; name: string }) {
    return this.prisma.admin.create({
      data,
    });
  }

  async adminVerify(email: string) {
    return this.prisma.admin.update({
      where: { email },
      data: { is_verified: true },
    });
  }
}

@Injectable()
export class AuthUserRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return (this.prisma as any).user.findUnique({
      where: { email },
    });
  }

  async createUser(data: { email: string; password: string; name: string }) {
    return (this.prisma as any).user.create({
      data,
    });
  }

  async userVerify(email: string) {
    return this.prisma.user.update({
      where: { email },
      data: { is_verified: true },
    });
  }


}