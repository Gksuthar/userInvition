import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admins')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminsController {}
