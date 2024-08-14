import { Module } from '@nestjs/common';
import { PermissionGuard } from './guards/permission.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionService } from './permission.service';

@Module({
  imports: [],
  providers: [PermissionService, PermissionGuard, RolesGuard],
  exports: [PermissionGuard, RolesGuard],
})
export class PermissionModule {}
