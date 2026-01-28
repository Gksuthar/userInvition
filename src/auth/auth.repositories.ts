import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Admin, User } from 'generated/prisma';

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
@Injectable()
export class AuthUserRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<User | null> {
    return this.prisma.user.create({
      data,
    });
  }

  async userVerify(email: string): Promise<User | null> {
    return this.prisma.user.update({
      where: { email },
      data: { is_verified: true },
    });
  }
}