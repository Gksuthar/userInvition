import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

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

