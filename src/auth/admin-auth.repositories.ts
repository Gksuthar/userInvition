import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Admin } from '@prisma/client';

@Injectable()
export class AuthAdminRepository {
  constructor(private prisma: PrismaService) {}

  async findAdminByEmail(email: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: { email },
    });
  }

  async createAdmin(data: {
    email: string;
    password: string;
    name: string;
    tenant_id: string | null;
  }): Promise<Admin | null> {
    return this.prisma.admin.create({
      data,
    });
  }

  async adminVerify(email: string): Promise<Admin | null> {
    return this.prisma.admin.update({
      where: { email },
      data: { is_verified: true },
    });
  }
}
