import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersRepository } from './users.repository';
import { AuthModule } from 'src/auth/auth.module';
// import { AdminGuard } from 'src/auth/guards/admin.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
