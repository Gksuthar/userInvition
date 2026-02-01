import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantDto } from './dto/Tenant.dto';
import { TenantService } from './Tenant.service';
import { TenantResponseDto } from './dto/Tenant.response.dto';
import { RequirePermission } from 'src/auth/decorator/require-permission.decorator';

@ApiTags('Tenant')
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'create Tenant ' })
  // @RequirePermission('tenant', 'create', 'admin')
  async createTenant(@Body() dto: TenantDto): Promise<TenantResponseDto> {
    return await this.tenantService.createTenantService(dto);
  }

  @Get()
  @ApiOperation({ summary: 'find Tenant By Slug' })
  async findTenantBySlugController(slug: string): Promise<TenantResponseDto | null> {
    const data = await this.tenantService.findTenantBySlugService(slug);
    return data;
  }
}
