import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserInfoResponseDto } from './dto/users.response.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private logger: Logger,
  ) {}

  async getUserInformation(email: string): Promise<UserInfoResponseDto> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      this.logger.warn({ email, message: 'user not found' });
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      is_verified: user.is_verified,
      invite_by: user.invite_by,
      role: user.role,
    };
  }

  async getUserByUserIdService(id: string): Promise<UserInfoResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      this.logger.warn({ id, message: 'user not found' });
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
