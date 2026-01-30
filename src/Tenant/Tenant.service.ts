import { Injectable } from '@nestjs/common';
import { TenantResponseDto } from './dto/Tenant.response.dto';
import { TenantRepository } from './Tenant.repository';
import { TenantDto } from './dto/Tenant.dto';

@Injectable()
export class TenantService {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async createTenantService(dto: TenantDto): Promise<TenantResponseDto> {
    return await this.tenantRepository.createTenantRepo(dto);
  }

  async findTenantBySlugService(slug: string): Promise<TenantResponseDto> {
    const data = await this.tenantRepository.findTenantBySlugRepo(slug);
    if (!data) {
      throw new Error('Tenant not found');
    }
    return data;
  }
}
