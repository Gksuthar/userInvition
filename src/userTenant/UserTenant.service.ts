import { UserTenantRepository } from './UserTenant.repository';
import { Injectable } from '@nestjs/common';
import { UserTenantResponseDto } from './dto/user-tenant.response.dto';
import { UserTenantDto } from './dto/user-tenant.dto';

@Injectable()
export class UserTenantService {
  constructor(private readonly userTenantRepository: UserTenantRepository) {}
  async createUserTenant(dto: UserTenantDto): Promise<UserTenantResponseDto> {
    const userTenant = await this.userTenantRepository.createUserTenant(dto);
    return userTenant as UserTenantResponseDto;
  }
}
